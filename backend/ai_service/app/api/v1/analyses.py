"""
Analysis creation and processing endpoints
"""
import uuid
from pathlib import Path
from typing import Optional
import sys

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session

# Add parent paths
sys.path.append(str(Path(__file__).parent.parent.parent.parent.parent))

from app.core.deps import get_db, get_current_user
from app.schemas.analysis import AnalysisResponse, AnalysisListResponse, AnalysisCreate
from backend.shared.models.ai import Analysis, Video


router = APIRouter()


async def process_video_task(analysis_id: uuid.UUID, video_id: uuid.UUID):
    """
    Background task to process video and generate analysis.
    This runs asynchronously after the API responds.
    """
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.core.config import settings
    from app.services.video_processor_service import VideoProcessorService
    from app.services.tactical_analysis_service import TacticalAnalysisService
    from datetime import datetime
    import traceback
    
    # Create new DB session for background task
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Get analysis and video
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        video = db.query(Video).filter(Video.id == video_id).first()
        
        if not analysis or not video:
            return
        
        # Update status to processing
        analysis.status = 'processing'
        analysis.processing_started_at = datetime.utcnow()
        video.status = 'processing'
        video.processing_started_at = datetime.utcnow()
        db.commit()
        
        # Process video to get tracking data
        video_processor = VideoProcessorService()
        tracking_data = video_processor.process_video(video.storage_path)
        
        # Run tactical analysis
        tactical_service = TacticalAnalysisService()
        analysis_results = tactical_service.generate_full_report(tracking_data)
        
        # Update analysis with results
        analysis.output_data = analysis_results
        analysis.status = 'completed'
        analysis.processing_completed_at = datetime.utcnow()
        
        # Update video status
        video.status = 'ready'
        video.processing_completed_at = datetime.utcnow()
        video.metadata = {
            'total_frames': len(tracking_data),
            'processing_info': 'Completed successfully'
        }
        
        db.commit()
        
    except Exception as e:
        # Update status to failed
        try:
            analysis.status = 'failed'
            analysis.output_data = {'error': str(e), 'traceback': traceback.format_exc()}
            video.status = 'failed'
            db.commit()
        except:
            pass
        print(f"Error processing video {video_id}: {e}")
        traceback.print_exc()
    
    finally:
        db.close()


@router.post("/", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def create_analysis(
    analysis_data: AnalysisCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Create a new analysis request for a video.
    Processing happens asynchronously in the background.
    
    - **video_id**: UUID of the uploaded video
    - **analysis_type**: Type of analysis (default: tactical_vulnerability)
    - **model_name**: Model to use (default: tactical_gnn_v1)
    """
    # Check if video exists and belongs to user
    video = db.query(Video).filter(
        Video.id == analysis_data.video_id,
        Video.uploaded_by == current_user.id,
        Video.deleted_at == None
    ).first()
    
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found"
        )
    
    if video.status == 'processing':
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Video is already being processed"
        )
    
    # Create analysis record
    analysis = Analysis(
        video_id=analysis_data.video_id,
        analysis_type=analysis_data.analysis_type or 'tactical_vulnerability',
        model_name=analysis_data.model_name or 'tactical_gnn_v1',
        status='pending',
        input_data=analysis_data.input_data or {}
    )
    
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    # Queue background processing task
    background_tasks.add_task(process_video_task, analysis.id, video.id)
    
    return analysis


@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get analysis details by ID"""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.deleted_at == None
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Verify user owns the video
    video = db.query(Video).filter(Video.id == analysis.video_id).first()
    if not video or video.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this analysis"
        )
    
    return analysis


@router.get("/", response_model=AnalysisListResponse)
async def list_analyses(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    video_id: Optional[uuid.UUID] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """List all analyses for current user's videos"""
    # Get user's video IDs
    video_ids = [v.id for v in db.query(Video.id).filter(
        Video.uploaded_by == current_user.id,
        Video.deleted_at == None
    ).all()]
    
    # Build query
    query = db.query(Analysis).filter(
        Analysis.video_id.in_(video_ids),
        Analysis.deleted_at == None
    )
    
    # Filter by specific video if provided
    if video_id:
        query = query.filter(Analysis.video_id == video_id)
    
    total = query.count()
    analyses = query.order_by(Analysis.created_at.desc()).offset(skip).limit(limit).all()
    
    return AnalysisListResponse(analyses=analyses, total=total)


@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_analysis(
    analysis_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete an analysis (soft delete)"""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.deleted_at == None
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Verify user owns the video
    video = db.query(Video).filter(Video.id == analysis.video_id).first()
    if not video or video.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this analysis"
        )
    
    # Soft delete
    from datetime import datetime
    analysis.deleted_at = datetime.utcnow()
    db.commit()
    
    return None
