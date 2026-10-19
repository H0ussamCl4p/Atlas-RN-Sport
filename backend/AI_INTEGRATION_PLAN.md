# AI Service Integration Plan - Complete MVP

## 📁 Proposed Structure

```
backend/
├── auth_service/          # Existing - handles auth
├── ai_service/            # NEW - handles video processing & AI
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py       # FastAPI app
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── videos.py      # Upload endpoints
│   │   │       ├── analyses.py    # Processing endpoints
│   │   │       └── reports.py     # Results endpoints
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   └── deps.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── video_processor.py    # From your video_processor.py
│   │   │   ├── gnn_model.py          # GNN predictions
│   │   │   └── tactical_analysis.py  # Tactical functions
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── video.py
│   │   │   └── analysis.py
│   │   └── workers/
│   │       └── analysis_worker.py    # Celery tasks (optional)
│   ├── models/                # Trained models
│   │   └── best_model.pth
│   ├── uploads/               # Temporary video storage
│   ├── .env
│   ├── requirements.txt
│   └── README.md
└── shared/                    # Existing - shared models
    ├── models/
    │   ├── ai.py             # Video, Analysis models ✓
    │   └── ...
```

## 🚀 Step-by-Step Implementation

### Step 1: Create AI Service Directory Structure

```bash
cd backend
mkdir -p ai_service/app/{api/v1,core,services,schemas,workers}
mkdir -p ai_service/models
mkdir -p ai_service/uploads
```

### Step 2: Copy Your AI Code

```bash
# Copy from football_tactical_analysis to ai_service/services/
cp ../../video_processor.py ai_service/app/services/
```

### Step 3: Create AI Service Configuration

**File: `backend/ai_service/.env`**

```env
# Service configuration
SERVICE_NAME=ai_service
SERVICE_VERSION=1.0.0
HOST=0.0.0.0
PORT=8002
ENVIRONMENT=development

# Database (shared with auth_service)
DATABASE_URL=postgresql://atlas:atlas_dev_2024@localhost:5432/atlas_db
# For development: DATABASE_URL=sqlite:///./atlas_dev.db

# Roboflow API
ROBOFLOW_API_KEY=your_roboflow_key_here

# Storage
UPLOAD_FOLDER=./uploads
MAX_VIDEO_SIZE_MB=500

# Model paths
MODEL_PATH=./models/best_model.pth

# JWT (for authentication with auth_service)
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256

# CORS
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

### Step 4: Create Requirements

**File: `backend/ai_service/requirements.txt`**

```txt
# FastAPI
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
python-multipart>=0.0.6
python-dotenv>=1.0.0

# Database
sqlalchemy>=2.0.23
psycopg2-binary>=2.9.9
alembic>=1.12.1

# Video Processing
supervision>=0.20.0 --no-deps
opencv-python>=4.8.0
inference>=0.9.0
inference-sdk>=0.9.0

# AI/ML
torch>=2.2.0
torch-geometric>=2.5.0
transformers>=4.35.0
umap-learn>=0.5.5
scikit-learn>=1.3.0

# Utilities
numpy>=1.26.0
pandas>=2.1.0
scipy>=1.11.0
pillow>=10.0.0
tqdm>=4.66.0

# Optional: Background tasks
celery>=5.3.4
redis>=5.0.1
```

### Step 5: Create Main FastAPI App

**File: `backend/ai_service/app/main.py`**

```python
"""
Atlas AI Service - Video Analysis & Tactical Intelligence

Handles video upload, processing, and tactical analysis generation.
"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1 import api_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize service on startup"""
    # Create upload directory
    Path(settings.UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)

    print(f"✓ {settings.SERVICE_NAME} v{settings.SERVICE_VERSION} started")
    print(f"✓ Environment: {settings.ENVIRONMENT}")
    print(f"✓ Upload folder: {settings.UPLOAD_FOLDER}")
    print(f"✓ API docs: http://{settings.HOST}:{settings.PORT}/docs")

    yield

    print(f"✓ {settings.SERVICE_NAME} shutting down")


# Create FastAPI app
app = FastAPI(
    title="Atlas AI Service",
    version="1.0.0",
    description="Football video analysis and tactical intelligence",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Serve uploaded files (for development only)
if settings.ENVIRONMENT == "development":
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_FOLDER), name="uploads")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION
    }
```

### Step 6: Create Video Upload Endpoint

**File: `backend/ai_service/app/api/v1/videos.py`**

```python
"""
Video upload and management endpoints
"""
import os
import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.core.config import settings
from app.schemas.video import VideoCreate, VideoResponse
from backend.shared.models.ai import Video


router = APIRouter(prefix="/videos", tags=["videos"])


@router.post("/upload", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
async def upload_video(
    file: UploadFile = File(...),
    match_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Upload a match video for analysis.

    - **file**: Video file (mp4, avi, mov)
    - **match_id**: Optional match UUID
    """
    # Validate file type
    allowed_extensions = {'.mp4', '.avi', '.mov', '.mkv'}
    file_ext = Path(file.filename).suffix.lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {allowed_extensions}"
        )

    # Generate unique filename
    video_id = uuid.uuid4()
    filename = f"{video_id}{file_ext}"
    file_path = Path(settings.UPLOAD_FOLDER) / filename

    # Save file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

    # Get file size
    file_size = os.path.getsize(file_path)

    # Create database record
    video = Video(
        id=video_id,
        match_id=match_id,
        uploaded_by=current_user.id,
        filename=file.filename,
        file_size_bytes=file_size,
        storage_path=str(file_path),
        storage_provider='local',
        status='uploaded'
    )

    db.add(video)
    db.commit()
    db.refresh(video)

    return video


@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(
    video_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get video details by ID"""
    video = db.query(Video).filter(Video.id == video_id).first()

    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )

    return video


@router.get("/", response_model=list[VideoResponse])
async def list_videos(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List all videos for current user"""
    videos = db.query(Video).filter(
        Video.uploaded_by == current_user.id
    ).offset(skip).limit(limit).all()

    return videos
```

### Step 7: Create Analysis Processing Endpoint

**File: `backend/ai_service/app/api/v1/analyses.py`**

```python
"""
Analysis processing endpoints
"""
import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.services.video_processor import FootballVideoProcessor
from app.services.gnn_model import predict_vulnerability
from app.services.tactical_analysis import generate_tactical_report
from app.core.config import settings
from app.schemas.analysis import AnalysisCreate, AnalysisResponse
from backend.shared.models.ai import Video, Analysis


router = APIRouter(prefix="/analyses", tags=["analyses"])


async def process_video_task(analysis_id: uuid.UUID, video_id: uuid.UUID, db: Session):
    """
    Background task to process video and generate analysis.
    This should be moved to Celery for production.
    """
    try:
        # Get video and analysis
        video = db.query(Video).filter(Video.id == video_id).first()
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()

        if not video or not analysis:
            return

        # Update status
        analysis.status = 'processing'
        analysis.processing_started_at = datetime.utcnow()
        db.commit()

        # Step 1: Process video
        processor = FootballVideoProcessor(
            roboflow_api_key=settings.ROBOFLOW_API_KEY
        )
        tracking_data = processor.process_video(video.storage_path)

        # Step 2: Run GNN predictions
        predictions = predict_vulnerability(tracking_data)

        # Step 3: Generate tactical report
        report = generate_tactical_report(predictions, tracking_data)

        # Update analysis with results
        analysis.status = 'completed'
        analysis.processing_completed_at = datetime.utcnow()
        analysis.output_data = report
        analysis.metadata_ = {
            'frames_processed': len(tracking_data),
            'predictions_count': len(predictions)
        }

        db.commit()

    except Exception as e:
        # Update analysis with error
        analysis.status = 'failed'
        analysis.processing_error = str(e)
        db.commit()


@router.post("/", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def create_analysis(
    video_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Start video analysis processing.

    - **video_id**: UUID of uploaded video
    """
    # Check if video exists
    video = db.query(Video).filter(Video.id == video_id).first()

    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )

    if video.status != 'uploaded':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Video is not ready for processing. Status: {video.status}"
        )

    # Create analysis record
    analysis = Analysis(
        video_id=video_id,
        match_id=video.match_id,
        created_by=current_user.id,
        analysis_type='tactical_vulnerability',
        model_name='TacticalVulnerabilityGNN',
        model_version='1.0.0',
        status='pending'
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    # Start processing in background
    background_tasks.add_task(process_video_task, analysis.id, video_id, db)

    return analysis


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get analysis details and results"""
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )

    return analysis


@router.get("/", response_model=list[AnalysisResponse])
async def list_analyses(
    video_id: Optional[uuid.UUID] = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List all analyses for current user"""
    query = db.query(Analysis).filter(Analysis.created_by == current_user.id)

    if video_id:
        query = query.filter(Analysis.video_id == video_id)

    analyses = query.offset(skip).limit(limit).all()

    return analyses
```

## 🔗 Frontend Integration

Update your React app to call the new AI service:

**File: `Atlas-RN-Sport/src/services/ai.ts`**

```typescript
import axios from "axios";

const AI_API_BASE = "http://localhost:8002/api/v1";

export const aiService = {
  // Upload video
  uploadVideo: async (file: File, matchId?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (matchId) formData.append("match_id", matchId);

    const response = await axios.post(
      `${AI_API_BASE}/videos/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  // Start analysis
  startAnalysis: async (videoId: string) => {
    const response = await axios.post(`${AI_API_BASE}/analyses/`, {
      video_id: videoId,
    });
    return response.data;
  },

  // Get analysis status
  getAnalysis: async (analysisId: string) => {
    const response = await axios.get(`${AI_API_BASE}/analyses/${analysisId}`);
    return response.data;
  },

  // List user's analyses
  listAnalyses: async () => {
    const response = await axios.get(`${AI_API_BASE}/analyses/`);
    return response.data;
  },
};
```

## 🚀 Running the Complete System

### Terminal 1: Auth Service

```bash
cd backend/auth_service
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn app.main:app --reload --port 8001
```

### Terminal 2: AI Service

```bash
cd backend/ai_service
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8002
```

### Terminal 3: Frontend

```bash
cd Atlas-RN-Sport
npm run dev
```

## 📊 Complete Flow

```
1. User logs in → Auth Service (8001)
   ↓
2. User uploads video → AI Service (8002) /videos/upload
   ↓ (saves to uploads/, creates Video record)
3. User starts analysis → AI Service /analyses/
   ↓ (creates Analysis record, status=pending)
4. Background task processes video
   ↓ (video_processor.py → tracking data)
5. GNN predictions
   ↓ (tactical_vulnerability_model → predictions)
6. Generate report
   ↓ (tactical_analysis functions → report)
7. Save results → Analysis.output_data (JSONB)
   ↓
8. Frontend polls /analyses/{id}
   ↓ (status: pending → processing → completed)
9. Display tactical report to user
```

## ✅ MVP Checklist

- [ ] Create `backend/ai_service/` directory structure
- [ ] Copy `video_processor.py` to services
- [ ] Create FastAPI endpoints (videos.py, analyses.py)
- [ ] Add authentication middleware
- [ ] Test video upload
- [ ] Test analysis processing
- [ ] Connect frontend to AI service
- [ ] Test end-to-end flow

## 🎯 Next Steps

Ready to start? I can help you:

1. **Create the files** - Generate all the code above
2. **Test locally** - Verify everything works
3. **Deploy** - Get it running on a server

Which would you like to do first?
