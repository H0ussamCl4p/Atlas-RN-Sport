"""
API v1 router aggregation.

Design: Centralizes all v1 endpoints for easy versioning.
New API versions (v2, v3) can be added alongside v1.
"""
from fastapi import APIRouter

from app.api.v1 import auth, health, users


# Create API v1 router
api_router = APIRouter()

# Include all v1 route modules
api_router.include_router(auth.router)
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(health.router)
