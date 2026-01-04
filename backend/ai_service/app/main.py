"""
Atlas AI Service - Main Application

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
    
    # Create models directory
    Path(settings.MODEL_PATH).parent.mkdir(parents=True, exist_ok=True)
    
    print(f"✓ {settings.SERVICE_NAME} v{settings.SERVICE_VERSION} started")
    print(f"✓ Environment: {settings.ENVIRONMENT}")
    print(f"✓ Upload folder: {settings.UPLOAD_FOLDER}")
    print(f"✓ Model path: {settings.MODEL_PATH}")
    print(f"✓ API docs: http://{settings.HOST}:{settings.PORT}/docs")
    
    yield
    
    print(f"✓ {settings.SERVICE_NAME} shutting down")


# Create FastAPI app
app = FastAPI(
    title="Atlas AI Service",
    version=settings.SERVICE_VERSION,
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
    upload_path = Path(settings.UPLOAD_FOLDER)
    if upload_path.exists():
        app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_FOLDER), name="uploads")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
        "status": "running",
        "docs": f"http://{settings.HOST}:{settings.PORT}/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
        "environment": settings.ENVIRONMENT
    }
