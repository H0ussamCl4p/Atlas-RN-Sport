"""
Atlas AI Service - Simplified Main Application (MVP Demo)

⚠️ IMPORTANT: This is a simplified version for MVP demo purposes.
Real production implementation would include:

- YOLO v8/v9 for player detection
- ByteTrack for multi-object tracking
- SigLIP for team classification
- EGNN (Equivariant Graph Neural Network) for tactical analysis
- Real-time video processing with OpenCV
- GPU acceleration with CUDA

See video_processor.py and app.py in root for full implementation.
This simplified version generates realistic but synthetic tactical data
for demonstration purposes without requiring heavy ML dependencies.
"""
from contextlib import asynccontextmanager
from pathlib import Path
from datetime import datetime
from typing import Optional
import uuid
import asyncio

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        extra="ignore"  # Ignore extra fields from .env
    )
    
    SERVICE_NAME: str = "Atlas AI Service"
    SERVICE_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8002
    DEBUG: bool = True
    
    JWT_SECRET_KEY: str = "your-super-secret-key-change-this-in-production-use-openssl-rand-hex-32"
    JWT_ALGORITHM: str = "HS256"
    
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://localhost:5174"
    
    UPLOAD_FOLDER: str = "./uploads"
    
    # Roboflow API key for YOLO models (optional - falls back to mock if not provided)
    ROBOFLOW_API_KEY: Optional[str] = None


settings = Settings()

# Real processor disabled - using optimized mock data only
# This provides instant results without YOLO processing overhead
USE_REAL_PROCESSOR = False
PROCESSOR_AVAILABLE = False
print("✓ Using optimized mock data (no YOLO processing)")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize service on startup"""
    # Create upload directory
    Path(settings.UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)
    
    print(f"✓ {settings.SERVICE_NAME} v{settings.SERVICE_VERSION} started")
    print(f"✓ Environment: {settings.ENVIRONMENT}")
    print(f"✓ Upload folder: {settings.UPLOAD_FOLDER}")
    print(f"✓ API docs: http://{settings.HOST}:{settings.PORT}/docs")
    
    # Initialize real processor if available
    if USE_REAL_PROCESSOR and settings.ROBOFLOW_API_KEY:
        try:
            analyzer = get_analyzer(settings.ROBOFLOW_API_KEY)
            print("✓ Real video analyzer initialized with YOLO models")
        except Exception as e:
            print(f"⚠ Could not initialize real analyzer: {e}")
    elif USE_REAL_PROCESSOR and not settings.ROBOFLOW_API_KEY:
        print("⚠ ROBOFLOW_API_KEY not set - will use mock data")
        print("  Set ROBOFLOW_API_KEY in .env to enable real video processing")
    
    yield


# Create FastAPI app
app = FastAPI(
    title=settings.SERVICE_NAME,
    version=settings.SERVICE_VERSION,
    lifespan=lifespan
)

# Configure CORS
origins = settings.CORS_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
        "environment": settings.ENVIRONMENT
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.SERVICE_NAME}",
        "version": settings.SERVICE_VERSION,
        "docs": f"/docs"
    }


# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class VideoResponse(BaseModel):
    id: str
    filename: str
    original_filename: str
    file_size: int
    duration: float
    uploaded_by: str
    status: str
    created_at: str


class AnalysisCreate(BaseModel):
    video_id: str
    analysis_type: str = "tactical_vulnerability"


class AnalysisResponse(BaseModel):
    id: str
    video_id: str
    analysis_type: str
    status: str
    created_by: str
    model_name: str
    output_data: Optional[dict] = None
    processing_error: Optional[str] = None
    created_at: str
    updated_at: str


# ============================================================================
# IN-MEMORY STORAGE (Demo purposes)
# ============================================================================

videos_db = {}
analyses_db = {}


# ============================================================================
# VIDEO ENDPOINTS
# ============================================================================

@app.post("/api/v1/videos/upload", response_model=VideoResponse)
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file (streaming - handles large files efficiently)
    
    Features:
    - Streams file to disk in 1MB chunks (memory efficient)
    - Validates file type and size (max 500MB)
    - Provides file size info for processing estimate
    - Handles large uploads (10+ minutes supported)
    """
    
    # Generate unique ID
    video_id = str(uuid.uuid4())
    
    # Validate file type
    allowed_types = ['video/mp4', 'video/avi', 'video/mov', 'video/x-matroska']
    if file.content_type not in allowed_types:
        if not file.filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
            raise HTTPException(status_code=400, detail="Invalid file type. Allowed: MP4, AVI, MOV, MKV")
    
    # Stream file to disk (memory-efficient)
    upload_path = Path(settings.UPLOAD_FOLDER) / f"{video_id}_{file.filename}"
    
    try:
        file_size = 0
        CHUNK_SIZE = 2 * 1024 * 1024  # 2MB chunks for faster uploads
        MAX_SIZE = 500 * 1024 * 1024  # 500MB max
        
        print(f"📥 Receiving upload: {file.filename}")
        
        with open(upload_path, "wb") as buffer:
            while True:
                # Use non-blocking read with timeout
                try:
                    chunk = await asyncio.wait_for(file.read(CHUNK_SIZE), timeout=60.0)
                except asyncio.TimeoutError:
                    upload_path.unlink()
                    raise HTTPException(status_code=408, detail="Upload timeout - chunk read exceeded 60s")
                
                if not chunk:
                    break
                
                buffer.write(chunk)
                file_size += len(chunk)
                
                # Check size limit during upload
                if file_size > MAX_SIZE:
                    upload_path.unlink()
                    raise HTTPException(
                        status_code=413,
                        detail=f"File too large. Max: 500MB, Got: {file_size / 1024 / 1024:.1f}MB"
                    )
        
        # Create video record with actual file info
        video = {
            "id": video_id,
            "filename": f"{video_id}_{file.filename}",
            "original_filename": file.filename,
            "file_size": file_size,
            "duration": 105.0,  # Will be calculated from actual video during analysis
            "uploaded_by": "demo-user",
            "status": "uploaded",
            "created_at": datetime.utcnow().isoformat()
        }
        
        videos_db[video_id] = video
        
        file_size_mb = file_size / 1024 / 1024
        est_time = int(file_size_mb * 0.5)  # ~0.5 sec per MB
        print(f"✅ Video uploaded: {file.filename} ({file_size_mb:.1f}MB, est. {est_time}s to process)")
        
        return VideoResponse(**video)
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Clean up on error
        if upload_path.exists():
            upload_path.unlink()
        print(f"❌ Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/api/v1/videos/{video_id}", response_model=VideoResponse)
async def get_video(video_id: str):
    """Get video details by ID"""
    if video_id not in videos_db:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return VideoResponse(**videos_db[video_id])


@app.get("/uploads/{filename}")
async def serve_video(filename: str):
    """Serve uploaded video files"""
    from fastapi.responses import FileResponse
    
    file_path = Path(settings.UPLOAD_FOLDER) / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Video file not found")
    
    return FileResponse(
        path=str(file_path),
        media_type="video/mp4",
        headers={"Accept-Ranges": "bytes"}
    )


# ============================================================================
# ANALYSIS ENDPOINTS
# ============================================================================

def generate_mock_analysis_results():
    """Generate realistic mock tactical analysis results with dynamic formations
    
    Creates different scenarios each time to simulate real match variations:
    - Different formations (4-3-3, 3-5-2, 4-2-3-1, etc.)
    - Different team positions and strategies
    - Realistic threat and weakness zones
    
    Note: This is demo data. Real implementation would use:
    - YOLO for player detection
    - ByteTrack for player tracking  
    - EGNN model for tactical analysis
    """
    import random
    import time
    
    # Use timestamp seed for deterministic but varying results
    random.seed(int(time.time() * 10) % 10000)
    
    # Formation options for variety
    formations = [
        {
            'name': '4-3-3',
            'home': [(10, 50), (25, 20), (25, 38), (25, 62), (25, 80), (45, 30), (45, 50), (45, 70), (70, 25), (70, 50), (70, 75)],
            'away': [(90, 50), (75, 20), (75, 38), (75, 62), (75, 80), (55, 25), (55, 42), (55, 58), (55, 75), (35, 38), (35, 62)]
        },
        {
            'name': '4-2-3-1',
            'home': [(10, 50), (25, 15), (25, 35), (25, 65), (25, 85), (45, 40), (45, 60), (55, 25), (55, 50), (55, 75), (70, 50)],
            'away': [(90, 50), (75, 20), (75, 38), (75, 62), (75, 80), (55, 30), (55, 70), (40, 25), (40, 50), (40, 75), (25, 50)]
        },
        {
            'name': '3-5-2',
            'home': [(10, 50), (30, 30), (30, 50), (30, 70), (50, 20), (50, 40), (50, 60), (50, 80), (70, 35), (70, 65), (85, 50)],
            'away': [(90, 50), (70, 25), (70, 50), (70, 75), (55, 15), (55, 40), (55, 60), (55, 85), (35, 30), (35, 70), (15, 50)]
        },
        {
            'name': '5-3-2',
            'home': [(10, 50), (25, 10), (25, 30), (25, 70), (25, 90), (45, 25), (45, 50), (45, 75), (70, 38), (70, 62), (85, 50)],
            'away': [(90, 50), (75, 15), (75, 35), (75, 65), (75, 85), (55, 30), (55, 50), (55, 70), (30, 40), (30, 60), (10, 50)]
        }
    ]
    
    # Select random formation
    selected_formation = random.choice(formations)
    home_positions = selected_formation['home']
    away_positions = selected_formation['away']
    
    # Generate realistic player positions based on selected formation
    players = []
    
    # Home team
    for i, (x, y) in enumerate(home_positions, 1):
        # Add small random variation for realism
        players.append({
            "id": f"home_{i}",
            "x": x + random.uniform(-3, 3),
            "y": y + random.uniform(-3, 3),
            "team": "home",
            "number": i,
            "role": "GK" if i == 1 else ("DEF" if i <= 5 else ("MID" if i <= 8 else "ATT"))
        })
    
    # Away team
    for i, (x, y) in enumerate(away_positions, 1):
        players.append({
            "id": f"away_{i}",
            "x": x + random.uniform(-3, 3),
            "y": y + random.uniform(-3, 3),
            "team": "away",
            "number": i,
            "role": "GK" if i == 1 else ("DEF" if i <= 5 else ("MID" if i <= 9 else "ATT"))
        })
    
    # Dynamic threat zones based on formation (attacking team = home)
    threat_zones = [
        {"zone_id": "T1", "x": 70 + random.uniform(-5, 5), "y": 50, "radius": 12, 
         "threat_score": random.uniform(0.75, 0.95), "player_count": random.randint(3, 6), 
         "label": "Central attacking zone"},
        {"zone_id": "T2", "x": 65 + random.uniform(-3, 3), "y": 25 + random.uniform(-5, 5), "radius": 8, 
         "threat_score": random.uniform(0.60, 0.80), "player_count": random.randint(2, 4), 
         "label": "Left wing pressure"},
        {"zone_id": "T3", "x": 65 + random.uniform(-3, 3), "y": 75 + random.uniform(-5, 5), "radius": 8, 
         "threat_score": random.uniform(0.55, 0.75), "player_count": random.randint(2, 4), 
         "label": "Right wing threat"},
    ]
    
    # Dynamic weakness zones (defending team = away)
    weakness_zones = [
        {"zone_id": "W1", "x": 75 + random.uniform(-5, 5), "y": 15 + random.uniform(-5, 5), 
         "radius": 8,
         "weakness_score": random.uniform(0.65, 0.85), "coverage": random.uniform(0.15, 0.35), 
         "label": "Lateral defensive weakness"},
        {"zone_id": "W2", "x": 55 + random.uniform(-5, 5), "y": 50, 
         "radius": 10,
         "weakness_score": random.uniform(0.55, 0.75), "coverage": random.uniform(0.20, 0.40), 
         "label": "Midfield gap"},
        {"zone_id": "W3", "x": 40 + random.uniform(-5, 5), "y": 50, 
         "radius": 7,
         "weakness_score": random.uniform(0.50, 0.70), "coverage": random.uniform(0.25, 0.45), 
         "label": "Transition zone"},
    ]
    
    # Realistic threat zones based on attacking areas
    return {
        "players": players,
        "threat_zones": threat_zones,
        "weakness_zones": weakness_zones,
        "xg_by_zone": [
            {"zone_id": "X1", "x": 60 + random.uniform(-10, 10), "y": 50, 
             "xg_value": random.uniform(0.35, 0.65), "shot_count": random.randint(2, 5)},
            {"zone_id": "X2", "x": 35 + random.uniform(-10, 10), "y": 30 + random.uniform(-10, 10), 
             "xg_value": random.uniform(0.20, 0.50), "shot_count": random.randint(1, 4)},
            {"zone_id": "X3", "x": 35 + random.uniform(-10, 10), "y": 70 + random.uniform(-10, 10), 
             "xg_value": random.uniform(0.15, 0.45), "shot_count": random.randint(1, 3)},
        ],
        "summary": {
            "total_players_detected": 22,
            "avg_players_per_frame": round(22 - random.uniform(0, 0.5), 1),
            "home_team_players": 11,
            "away_team_players": 11,
            "formations_detected": {
                "home": selected_formation['name'],
                "away": random.choice(['4-3-3', '4-4-2', '3-5-2', '5-3-2'])
            },
            "key_metrics": {
                "possession_zones": random.randint(6, 10),
                "high_pressure_areas": random.randint(2, 4),
                "defensive_vulnerabilities": random.randint(3, 5)
            },
            "key_player_dependency": {
                "player_id": "away_10",
                "team": "away",
                "number": 10,
                "involvement_pct": round(random.uniform(0.5, 0.7), 2),
                "label": "Chef d'orchestre",
                "x": 55 + random.uniform(-5, 5),
                "y": 50 + random.uniform(-10, 10),
            },
            "counter_attack_risk": {
                "zone": "midfield",
                "risk_score": round(random.uniform(0.55, 0.8), 2),
                "note": "Perte de balle au milieu → contre dangereux",
                "y_min": 40,
                "y_max": 60,
            }
        },
        "vulnerability_scores": {
            "defensive_line": round(random.uniform(0.25, 0.45), 2),
            "midfield": round(random.uniform(0.35, 0.55), 2),
            "attacking_line": round(random.uniform(0.20, 0.40), 2),
            "pressure_vulnerability": round(random.uniform(0.30, 0.50), 2),
            "spacing_vulnerability": round(random.uniform(0.25, 0.45), 2),
            "key_player_dependency": round(random.uniform(0.40, 0.65), 2)
        }
    }


async def process_analysis_background(analysis_id: str):
    """Process video analysis - generates realistic mock tactical data instantly"""
    
    # Update status to processing
    if analysis_id in analyses_db:
        analyses_db[analysis_id]["status"] = "processing"
        analyses_db[analysis_id]["updated_at"] = datetime.utcnow().isoformat()
    
    try:
        # Generate mock analysis data instantly
        print(f"📊 Generating tactical analysis for {analysis_id}")
        
        # Small delay to simulate processing (cosmetic)
        await asyncio.sleep(0.5)
        
        if analysis_id in analyses_db:
            analyses_db[analysis_id]["status"] = "completed"
            analyses_db[analysis_id]["output_data"] = generate_mock_analysis_results()
            analyses_db[analysis_id]["updated_at"] = datetime.utcnow().isoformat()
            print(f"✅ Analysis complete: {analysis_id}")
            
    except Exception as e:
        print(f"❌ Analysis processing failed: {e}")
        if analysis_id in analyses_db:
            analyses_db[analysis_id]["status"] = "failed"
            analyses_db[analysis_id]["processing_error"] = str(e)
            analyses_db[analysis_id]["updated_at"] = datetime.utcnow().isoformat()


@app.post("/api/v1/analyses/", response_model=AnalysisResponse)
async def create_analysis(
    analysis_data: AnalysisCreate,
    background_tasks: BackgroundTasks
):
    """Create a new analysis request"""
    
    # Check if video exists
    if analysis_data.video_id not in videos_db:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Generate unique ID
    analysis_id = str(uuid.uuid4())
    
    # Create analysis record
    analysis = {
        "id": analysis_id,
        "video_id": analysis_data.video_id,
        "analysis_type": analysis_data.analysis_type,
        "status": "pending",
        "created_by": "demo-user",
        "model_name": "tactical_gnn_v1",
        "output_data": None,
        "processing_error": None,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    analyses_db[analysis_id] = analysis
    
    # Start background processing
    background_tasks.add_task(process_analysis_background, analysis_id)
    
    return AnalysisResponse(**analysis)


@app.get("/api/v1/analyses/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str):
    """Get analysis results by ID"""
    if analysis_id not in analyses_db:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    return AnalysisResponse(**analyses_db[analysis_id])


# ---------------------------------------------------------------------------
# Legacy compatibility endpoint for frontend expecting /api/analysis/<id>
# ---------------------------------------------------------------------------
@app.get("/api/analysis/{analysis_id}")
async def legacy_analysis_endpoint(analysis_id: str):
    """Provide mock analysis payload matching the frontend contract.

    This mirrors generate_mock_analysis_results() and adapts keys so the
    React page can consume results without extra mapping.
    """

    data = generate_mock_analysis_results()

    # Align naming with frontend expectations
    adapted = {
        "players": data.get("players", []),
        "threat_zones": data.get("threat_zones", []),
        "weakness_zones": data.get("weakness_zones", []),
        "xg_zones": data.get("xg_by_zone", []),
        "summary": data.get("summary", {}),
        "vulnerability": data.get("summary", {}).get("vulnerability", {}),
        "key_player_dependency": data.get("summary", {}).get("key_player_dependency"),
        "counter_attack_risk": data.get("summary", {}).get("counter_attack_risk"),
    }

    return {"analysis": {"status": "completed"}, "results": adapted}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main_simple:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
