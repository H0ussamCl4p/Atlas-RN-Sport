"""
API v1 router aggregation
"""
from fastapi import APIRouter

from app.api.v1 import videos, analyses


# Create API v1 router
api_router = APIRouter()

# Include all v1 route modules
api_router.include_router(videos.router, prefix="/videos", tags=["videos"])
api_router.include_router(analyses.router, prefix="/analyses", tags=["analyses"])
