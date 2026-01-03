"""
Health check endpoint for monitoring and load balancers.

Design: Essential for production deployments. Allows monitoring systems
and load balancers to verify service health.
"""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db


router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/")
async def health_check() -> dict:
    """
    Basic health check endpoint.
    
    Design: Returns service status without database dependency.
    Used by load balancers for quick health verification.
    
    Returns:
        Service status information
    """
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT
    }


@router.get("/db")
async def health_check_db(db: Session = Depends(get_db)) -> dict:
    """
    Health check with database connectivity test.
    
    Design: Verifies database connection is working.
    Used for detailed health monitoring.
    
    Args:
        db: Database session (injected)
        
    Returns:
        Service status with database connectivity info
        
    Raises:
        Exception: If database connection fails
    """
    try:
        # Execute simple query to verify database connectivity
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": db_status
    }
