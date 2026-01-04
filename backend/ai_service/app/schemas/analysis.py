"""
Analysis schemas for request/response validation
"""
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel


class AnalysisBase(BaseModel):
    """Base analysis schema"""
    video_id: UUID
    analysis_type: str = "tactical_vulnerability"


class AnalysisCreate(AnalysisBase):
    """Schema for creating an analysis"""
    pass


class AnalysisResponse(AnalysisBase):
    """Schema for analysis response"""
    id: UUID
    match_id: Optional[UUID] = None
    created_by: UUID
    model_name: str
    model_version: Optional[str] = None
    status: str
    priority: int = 5
    processing_started_at: Optional[datetime] = None
    processing_completed_at: Optional[datetime] = None
    processing_error: Optional[str] = None
    output_data: Optional[Dict[str, Any]] = None
    metadata_: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AnalysisListResponse(BaseModel):
    """Schema for list of analyses"""
    analyses: list[AnalysisResponse]
    total: int
