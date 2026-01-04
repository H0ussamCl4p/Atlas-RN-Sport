# AI Service - Complete Implementation Summary

## Overview

Complete FastAPI microservice for football tactical analysis, integrating video processing, GNN-based vulnerability detection, and tactical insights generation.

**Service Port:** 8002  
**Architecture:** Microservices (integrates with auth_service on port 8001)  
**Database:** Shared PostgreSQL with auth_service  
**Authentication:** JWT tokens (stateless)

## Files Created

### Configuration & Setup (5 files)

1. **`.env.example`** - Environment variable template

   - Service config (PORT=8002)
   - Roboflow API key
   - JWT secret (shared with auth_service)
   - Database URL
   - CORS origins

2. **`requirements.txt`** - Python dependencies

   - FastAPI + Uvicorn
   - SQLAlchemy + psycopg2
   - PyTorch + PyTorch Geometric
   - Transformers (SigLIP)
   - Supervision (video processing)
   - Inference (Roboflow)
   - OpenCV, NumPy, UMAP

3. **`SETUP.md`** - Complete setup guide

   - Installation steps
   - Environment configuration
   - Testing instructions
   - Troubleshooting guide
   - Frontend integration examples

4. **`run.bat`** - Windows run script

   - Activates venv
   - Checks .env
   - Starts service with auto-reload

5. **`run.sh`** - Linux/Mac run script
   - Same functionality as run.bat

### Core Application (3 files)

6. **`app/core/config.py`** - Pydantic settings

   - Loads environment variables
   - Validates configuration
   - Provides settings object

7. **`app/core/deps.py`** - Dependency injection

   - `get_db()`: Database session factory
   - `get_current_user()`: JWT authentication
   - Integrates with shared database models

8. **`app/main.py`** - FastAPI application
   - CORS middleware configuration
   - Lifespan events (create directories)
   - API router inclusion
   - Health check endpoint
   - Static file serving for uploads

### API Endpoints (2 files)

9. **`app/api/v1/videos.py`** - Video management

   - **POST /upload**: Upload video with validation
   - **GET /{video_id}**: Get video details
   - **GET /**: List user's videos (paginated)
   - **DELETE /{video_id}**: Soft delete video
   - Features:
     - File type validation (.mp4, .avi, .mov, .mkv)
     - Video metadata extraction (duration, fps, resolution)
     - User ownership verification
     - Database record creation

10. **`app/api/v1/analyses.py`** - Analysis management
    - **POST /**: Create analysis (starts background processing)
    - **GET /{analysis_id}**: Get analysis results
    - **GET /**: List user's analyses (paginated)
    - **DELETE /{analysis_id}**: Soft delete analysis
    - Features:
      - Background task processing
      - Status tracking (pending → processing → completed/failed)
      - User authorization checks
      - Error handling with detailed logs

### Pydantic Schemas (2 files)

11. **`app/schemas/video.py`** - Video data models

    - `VideoCreate`: Upload request
    - `VideoResponse`: Single video response
    - `VideoListResponse`: Paginated list response

12. **`app/schemas/analysis.py`** - Analysis data models
    - `AnalysisCreate`: Analysis request
    - `AnalysisResponse`: Single analysis response
    - `AnalysisListResponse`: Paginated list response

### Service Layer (3 files)

13. **`app/services/video_processor_service.py`** - Video processing wrapper

    - **Core Methods:**
      - `process_video()`: Full pipeline (detection → tracking → team classification → homography)
      - `extract_frame_sample()`: Quick preview (10 frames)
      - `get_video_metadata()`: Extract video info without processing
      - `convert_to_freeze_frame()`: GNN input format conversion
    - **Integration:**
      - Wraps `video_processor.py` from football_tactical_analysis/
      - Adds service-compatible interface
      - Handles Roboflow API key from environment

14. **`app/services/gnn_model_service.py`** - GNN model wrapper

    - **Model Architecture:**
      - TacticalVulnerabilityGNN class
      - 3-layer EGNN with 64 hidden dimensions
      - 6 output heads (multi-task learning)
    - **Core Methods:**
      - `load_model()`: Load trained weights
      - `prepare_graph_data()`: Convert freeze frame to PyG Data
      - `predict()`: Single frame inference
      - `batch_predict()`: Multiple frames inference
    - **Output Format:**
      - Line vulnerability (defensive/midfield/attacking)
      - Pressure vulnerability (low/medium/high)
      - Spacing vulnerability (compact/normal/stretched)
      - Key player dependency score
      - Counter-attack risk score
      - Combined vulnerability scores

15. **`app/services/tactical_analysis_service.py`** - Tactical analysis wrapper
    - **Analysis Functions:**
      - `detect_threat_zones()`: High-threat zone heatmap
      - `detect_weakness_zones()`: Low-coverage zone detection
      - `calculate_xg_by_zone()`: Expected goals by pitch zone
      - `generate_full_report()`: Complete tactical analysis
    - **Output Format:**
      - Heatmaps (grid-based)
      - Critical zones (top 5 per metric)
      - Summary statistics

### Module Init Files (3 files)

16. **`app/__init__.py`** - Main app package
17. **`app/api/__init__.py`** - API package
18. **`app/api/v1/__init__.py`** - API v1 router aggregation
19. **`app/services/__init__.py`** - Services package
20. **`app/schemas/__init__.py`** - Schemas package

## Directory Structure

```
ai_service/
├── app/
│   ├── __init__.py
│   ├── main.py                           # FastAPI application
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                     # Settings
│   │   └── deps.py                       # Dependencies
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py               # Router aggregation
│   │       ├── videos.py                 # Video endpoints
│   │       └── analyses.py               # Analysis endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── video_processor_service.py    # Video processing
│   │   ├── gnn_model_service.py          # GNN predictions
│   │   └── tactical_analysis_service.py  # Tactical analysis
│   └── schemas/
│       ├── __init__.py
│       ├── video.py                      # Video schemas
│       └── analysis.py                   # Analysis schemas
├── models/                               # Trained model weights
│   └── (place best_model.pth here)
├── uploads/                              # Uploaded videos
├── .env.example                          # Environment template
├── requirements.txt                      # Dependencies
├── SETUP.md                             # Setup guide
├── run.bat                              # Windows run script
└── run.sh                               # Linux/Mac run script
```

## Key Features

### 1. Video Upload & Management

- Multi-format support (mp4, avi, mov, mkv)
- Automatic metadata extraction (duration, fps, resolution)
- File size validation
- User ownership tracking
- Soft delete support

### 2. Background Processing

- Async video processing (doesn't block API response)
- Status tracking (pending → processing → completed/failed)
- Error handling with detailed logs
- Result storage in JSONB (flexible schema)

### 3. Authentication & Authorization

- JWT token verification
- Shared secret with auth_service
- User-based resource access control
- Stateless authentication

### 4. Database Integration

- Shared PostgreSQL database
- SQLAlchemy ORM
- Video and Analysis models from `backend/shared/models/ai.py`
- JSONB fields for flexible AI data storage

### 5. Video Processing Pipeline

- YOLO detection (players, ball, goalkeeper, referee)
- ByteTrack tracking (persistent player IDs)
- SigLIP team classification (UMAP + KMeans)
- Pitch keypoint detection
- Homography transformation (5-frame smoothing)

### 6. GNN Model Integration

- 3-layer Equivariant GNN
- Multi-task learning (6 output heads)
- PyTorch Geometric Data format
- GPU/CPU support

### 7. Tactical Analysis

- Threat zone detection (opponent density - teammate density)
- Weakness zone detection (low defensive coverage)
- xG by zone (position-based expected goals)
- Grid-based heatmaps (10x10 or 5x5)
- Top N critical zones

## API Endpoints

### Videos

- `POST /api/v1/videos/upload` - Upload video
- `GET /api/v1/videos/{video_id}` - Get video
- `GET /api/v1/videos/` - List videos
- `DELETE /api/v1/videos/{video_id}` - Delete video

### Analyses

- `POST /api/v1/analyses/` - Create analysis
- `GET /api/v1/analyses/{analysis_id}` - Get analysis
- `GET /api/v1/analyses/` - List analyses
- `DELETE /api/v1/analyses/{analysis_id}` - Delete analysis

### System

- `GET /` - Root endpoint
- `GET /health` - Health check
- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc

## Data Flow

1. **User uploads video** → `/api/v1/videos/upload`

   - File saved to `uploads/`
   - Metadata extracted
   - Video record created in DB (status: 'uploaded')

2. **User requests analysis** → `/api/v1/analyses/`

   - Analysis record created (status: 'pending')
   - Background task queued
   - API responds immediately with analysis ID

3. **Background processing**:

   - Status → 'processing'
   - Video processing (YOLO + ByteTrack + SigLIP + Homography)
   - Tactical analysis (threat zones, weaknesses, xG)
   - GNN predictions (optional, if model available)
   - Results stored in `output_data` (JSONB)
   - Status → 'completed' or 'failed'

4. **User polls for results** → `/api/v1/analyses/{analysis_id}`
   - Check `status` field
   - If 'completed', read `output_data`
   - Display tactical report in frontend

## Integration Points

### With auth_service (port 8001)

- Shared `JWT_SECRET_KEY` for token verification
- Shared database (Video and Analysis tables)
- User ID from JWT payload for ownership

### With football_tactical_analysis/

- Imports `video_processor.py` for video processing
- Adds parent directory to Python path
- No code duplication

### With React Frontend (port 5173)

- CORS enabled for `http://localhost:5173`
- REST API for video upload and analysis
- JWT token in Authorization header
- Polling for analysis status

## Configuration Required

### Before First Run

1. **Create `.env`** from `.env.example`:

   ```bash
   copy .env.example .env
   ```

2. **Fill in values**:

   - `ROBOFLOW_API_KEY`: Get from https://app.roboflow.com/
   - `JWT_SECRET_KEY`: Must match auth_service
   - `DATABASE_URL`: PostgreSQL connection string

3. **Copy trained model**:

   ```bash
   copy path\to\best_model.pth models\best_model.pth
   ```

4. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

5. **Run the service**:
   ```bash
   run.bat
   ```

## Testing

### Manual Testing

```bash
# Health check
curl http://localhost:8002/health

# Upload video (requires JWT token)
curl -X POST http://localhost:8002/api/v1/videos/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@video.mp4"

# Create analysis
curl -X POST http://localhost:8002/api/v1/analyses/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"video_id": "VIDEO_UUID"}'

# Check analysis status
curl http://localhost:8002/api/v1/analyses/ANALYSIS_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### API Documentation

- Swagger UI: http://localhost:8002/docs
- ReDoc: http://localhost:8002/redoc

## Next Steps

1. ✅ **All files created** (20 files)
2. 🔄 **Configure environment** (`.env` file)
3. 🔄 **Install dependencies** (`pip install -r requirements.txt`)
4. 🔄 **Copy trained model** (`models/best_model.pth`)
5. 🔄 **Test endpoints** (health check, upload, analysis)
6. 🔄 **Frontend integration** (create `src/services/ai.ts`)
7. 🔄 **Deploy to production**

## Notes

- **Background tasks**: Processing runs async, doesn't block API response
- **GPU support**: Automatically uses CUDA if available
- **Error handling**: All errors logged with traceback, stored in `output_data`
- **Scalability**: Can add more workers for production (`--workers 4`)
- **Monitoring**: Check logs in terminal, analysis status in database
- **Security**: JWT authentication, user-based authorization, file type validation

## Troubleshooting

See [SETUP.md](SETUP.md#troubleshooting) for detailed troubleshooting guide.

Common issues:

- Missing `video_processor.py`: Check path in `video_processor_service.py`
- Import errors: Verify dependencies installed
- Database errors: Check `DATABASE_URL` and PostgreSQL running
- Roboflow errors: Verify API key and quota limits
- JWT errors: Ensure secret matches auth_service
