"""
Atlas Authentication Service - Main Application

Design: FastAPI application with production-ready configuration.
Includes CORS, error handling, API versioning, and database initialization.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import api_router
from app.core.config import settings
from app.db.session import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan events.
    
    Design: Initialize database on startup, cleanup on shutdown.
    Using lifespan context manager for proper resource management.
    """
    # Startup: Initialize database
    init_db()
    print(f"Database initialized")
    print(f"{settings.APP_NAME} v{settings.APP_VERSION} started")
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"API docs: http://{settings.HOST}:{settings.PORT}/docs")
    
    yield
    
    # Shutdown: Cleanup resources
    print(f"{settings.APP_NAME} shutting down")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Stateless authentication microservice for Atlas platform",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)


# ============================================================================
# CORS Configuration
# ============================================================================
# Design: Enable CORS for frontend communication.
# In production, restrict origins to your actual frontend domains.

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Frontend URLs
    allow_credentials=True,  # Allow cookies and authorization headers
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# ============================================================================
# API Routers
# ============================================================================
# Design: All routes are versioned under /api/v1
# Future versions (v2, v3) can be added without breaking existing clients

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


# ============================================================================
# Root Endpoint
# ============================================================================

@app.get("/")
async def root() -> dict:
    """
    Root endpoint - Service information.
    
    Returns:
        Service metadata
    """
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "health": f"{settings.API_V1_PREFIX}/health"
    }


# ============================================================================
# Global Exception Handler
# ============================================================================
# Design: Catch-all exception handler for unexpected errors.
# Prevents sensitive error details from leaking to clients in production.

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for unhandled errors.
    
    Design: Logs full error for debugging, returns generic message to client.
    """
    print(f"Unhandled exception: {exc}")
    
    if settings.DEBUG:
        # In debug mode, return detailed error
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(exc)}"}
        )
    else:
        # In production, return generic error
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )


# ============================================================================
# Run Application
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    import sys
    import os
    
    # Add parent directory to Python path so 'app' module can be found
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Run with uvicorn (ASGI server)
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,  # Auto-reload on code changes in debug mode
        log_level=settings.LOG_LEVEL.lower()
    )
