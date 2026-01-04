"""
Video schemas for request/response validation
"""
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class VideoBase(BaseModel):
    """Base video schema"""
    filename: str
    match_id: Optional[UUID] = None


class VideoCreate(VideoBase):
    """Schema for creating a video"""
    pass


class VideoResponse(VideoBase):
    """Schema for video response"""
    id: UUID
    uploaded_by: UUID
    file_size_bytes: Optional[int] = None
    duration_seconds: Optional[int] = None
    resolution: Optional[str] = None
    fps: Optional[int] = None
    storage_path: str
    storage_provider: str
    status: str
    thumbnail_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class VideoListResponse(BaseModel):
    """Schema for list of videos"""
    videos: list[VideoResponse]
    total: int
