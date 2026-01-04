"""
Video upload and management endpoints
"""
import os
import uuid
from pathlib import Path
from typing import Optional
import sys

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import cv2

# Add parent paths
sys.path.append(str(Path(__file__).parent.parent.parent.parent.parent))

from app.core.deps import get_db, get_current_user
from app.core.config import settings
from app.schemas.video import VideoResponse, VideoListResponse
from backend.shared.models.ai import Video


router = APIRouter()


@router.post("/upload", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
async def upload_video(
    file: UploadFile = File(...),
    match_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Upload a match video for analysis.
    
    - **file**: Video file (mp4, avi, mov, mkv)
    - **match_id**: Optional match UUID
    """
    # Validate file type
    allowed_extensions = {'.mp4', '.avi', '.mov', '.mkv'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file_ext}'. Allowed: {', '.join(allowed_extensions)}"
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
    
    # Get video metadata
    file_size = os.path.getsize(file_path)
    
    # Extract video metadata using OpenCV
    duration_seconds = None
    fps = None
    resolution = None
    try:
        cap = cv2.VideoCapture(str(file_path))
        if cap.isOpened():
            fps = int(cap.get(cv2.CAP_PROP_FPS))
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            if fps > 0:
                duration_seconds = int(frame_count / fps)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            resolution = f"{width}x{height}"
            cap.release()
    except Exception as e:
        print(f"Warning: Could not extract video metadata: {e}")
    
    # Create database record
    video = Video(
        id=video_id,
        match_id=match_id if match_id else None,
        uploaded_by=current_user.id,
        filename=file.filename,
        file_size_bytes=file_size,
        duration_seconds=duration_seconds,
        fps=fps,
        resolution=resolution,
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
    video = db.query(Video).filter(
        Video.id == video_id,
        Video.deleted_at == None
    ).first()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    return video


@router.get("/", response_model=VideoListResponse)
async def list_videos(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List all videos for current user"""
    query = db.query(Video).filter(
        Video.uploaded_by == current_user.id,
        Video.deleted_at == None
    )
    
    total = query.count()
    videos = query.order_by(Video.created_at.desc()).offset(skip).limit(limit).all()
    
    return VideoListResponse(videos=videos, total=total)


@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_video(
    video_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete a video (soft delete)"""
    video = db.query(Video).filter(
        Video.id == video_id,
        Video.uploaded_by == current_user.id,
        Video.deleted_at == None
    ).first()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    # Soft delete
    from datetime import datetime
    video.deleted_at = datetime.utcnow()
    db.commit()
    
    # Optionally delete file from storage
    try:
        if os.path.exists(video.storage_path):
            os.remove(video.storage_path)
    except Exception as e:
        print(f"Warning: Could not delete file: {e}")
    
    return None
