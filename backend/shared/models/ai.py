"""
AI Analysis domain models for ML/AI pipeline and results.

Design: Heavy use of JSONB for flexibility with AI model inputs/outputs.
These schemas evolve rapidly as models improve, so JSONB prevents constant migrations.
"""
from sqlalchemy import Column, String, Integer, Float, ForeignKey, Index, CheckConstraint, Text, BigInteger
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from backend.shared.models.base import SoftDeleteModel, BaseModel


# ============================================================================
# Videos
# ============================================================================

class Video(SoftDeleteModel):
    """
    Video entity for match footage.
    
    Design: Stores video metadata and processing status.
    Actual video files stored in object storage (S3, GCS, or local).
    """
    __tablename__ = "videos"
    
    match_id = Column(UUID(as_uuid=True), ForeignKey("matches.id", ondelete="SET NULL"), nullable=True)
    uploaded_by = Column(UUID(as_uuid=True), nullable=False)  # User ID (cross-service reference)
    
    # File information
    filename = Column(String(500), nullable=False)
    file_size_bytes = Column(BigInteger)
    duration_seconds = Column(Integer)
    resolution = Column(String(20))  # "1920x1080"
    fps = Column(Integer)  # Frames per second
    codec = Column(String(50))
    
    # Storage
    storage_path = Column(Text, nullable=False)  # S3: s3://bucket/path, Local: /uploads/video.mp4
    storage_provider = Column(String(50), default='local')  # local, s3, gcs, azure
    
    # Processing status
    status = Column(String(50), default='uploaded', nullable=False)  # uploaded, processing, ready, failed
    processing_started_at = Column("processing_started_at", sqlalchemy.DateTime)
    processing_completed_at = Column("processing_completed_at", sqlalchemy.DateTime)
    processing_error = Column(Text)
    
    # Thumbnail
    thumbnail_url = Column(String(500))
    
    # Extended metadata
    # Example: {"camera_angle": "tactical", "quality": "hd", "compression": "h264"}
    metadata_ = Column("metadata", JSONB, default=dict)
    
    # Relationships
    analyses = relationship("Analysis", back_populates="video")
    
    __table_args__ = (
        Index('idx_videos_match', 'match_id', postgresql_where=(deleted_at == None)),
        Index('idx_videos_status', 'status'),
        Index('idx_videos_uploaded_by', 'uploaded_by'),
        Index('idx_videos_created_at', 'created_at'),
    )
    
    def __repr__(self) -> str:
        return f"<Video(id={self.id}, filename={self.filename})>"


# ============================================================================
# Analyses
# ============================================================================

class Analysis(SoftDeleteModel):
    """
    AI/ML analysis job and results.
    
    Design: Central table for all AI analysis types.
    Uses JSONB heavily for:
    - Model configuration (hyperparameters)
    - Input data (reproducibility)
    - Output data (predictions, detections)
    - Quality metrics (model performance)
    
    This allows any AI model to be integrated without schema changes.
    """
    __tablename__ = "analyses"
    
    match_id = Column(UUID(as_uuid=True), ForeignKey("matches.id", ondelete="SET NULL"), nullable=True)
    video_id = Column(UUID(as_uuid=True), ForeignKey("videos.id", ondelete="SET NULL"), nullable=True)
    created_by = Column(UUID(as_uuid=True), nullable=False)  # User who initiated
    
    # Analysis classification
    analysis_type = Column(String(100), nullable=False)  # event_detection, formation, heatmap, player_tracking
    model_name = Column(String(100), nullable=False)  # yolov8-player-detector, formation-classifier-v2
    model_version = Column(String(50))  # v1.0.0, 2024-01-15
    
    # Processing status
    status = Column(String(50), default='pending', nullable=False)  # pending, queued, processing, completed, failed
    priority = Column(Integer, default=5)  # 1-10, higher = more urgent
    
    # Timing
    queued_at = Column("queued_at", sqlalchemy.DateTime)
    started_at = Column("started_at", sqlalchemy.DateTime)
    completed_at = Column("completed_at", sqlalchemy.DateTime)
    processing_duration_seconds = Column(Integer)
    
    # Model configuration (JSONB)
    # Example: {
    #   "architecture": "YOLOv8-large",
    #   "confidence_threshold": 0.6,
    #   "batch_size": 16,
    #   "device": "cuda:0"
    # }
    model_config = Column(JSONB, default=dict)
    
    # Input data (JSONB for reproducibility)
    # Example: {
    #   "video_config": {"start_frame": 0, "end_frame": 54000, "fps": 30},
    #   "roi": {"pitch_boundaries": [[120, 80], [1800, 1000]]},
    #   "preprocessing": {"enhance_contrast": true}
    # }
    input_data = Column(JSONB, default=dict)
    
    # Output data (JSONB for AI results)
    # Structure varies by analysis_type
    # Examples in DATABASE_ARCHITECTURE.md
    output_data = Column(JSONB, default=dict)
    
    # Quality metrics
    confidence_score = Column(Float)  # Overall confidence (0-1)
    quality_metrics = Column(JSONB)  # Precision, recall, F1, etc.
    
    # Error handling
    error_message = Column(Text)
    error_traceback = Column(Text)
    retry_count = Column(Integer, default=0)
    
    # Extended metadata
    # Example: {"gpu_used": "Tesla V100", "memory_peak_mb": 4096, "worker_id": "worker-01"}
    metadata_ = Column("metadata", JSONB, default=dict)
    
    # Relationships
    video = relationship("Video", back_populates="analyses")
    events = relationship("Event", back_populates="analysis")
    heatmaps = relationship("Heatmap", back_populates="analysis")
    formations = relationship("Formation", back_populates="analysis")
    
    __table_args__ = (
        Index('idx_analyses_match', 'match_id', postgresql_where=(deleted_at == None)),
        Index('idx_analyses_video', 'video_id', postgresql_where=(deleted_at == None)),
        Index('idx_analyses_status', 'status'),
        Index('idx_analyses_type', 'analysis_type'),
        Index('idx_analyses_created_by', 'created_by'),
        Index('idx_analyses_priority', 'priority', postgresql_where=(status.in_(['pending', 'queued']))),
        Index('idx_analyses_output_data', 'output_data', postgresql_using='gin'),  # JSONB index
        Index('idx_analyses_model_config', 'model_config', postgresql_using='gin'),  # JSONB index
        CheckConstraint('priority >= 1 AND priority <= 10', name='check_priority_range'),
        CheckConstraint('confidence_score >= 0 AND confidence_score <= 1', name='check_confidence_range'),
    )
    
    def __repr__(self) -> str:
        return f"<Analysis(id={self.id}, type={self.analysis_type}, status={self.status})>"
    
    @property
    def is_completed(self) -> bool:
        """Check if analysis is completed successfully."""
        return self.status == 'completed'
    
    @property
    def is_failed(self) -> bool:
        """Check if analysis failed."""
        return self.status == 'failed'
    
    @property
    def can_retry(self) -> bool:
        """Check if analysis can be retried."""
        return self.status == 'failed' and self.retry_count < 3


# ============================================================================
# Events
# ============================================================================

class Event(SoftDeleteModel):
    """
    Match events (pass, shot, tackle, etc.).
    
    Design: Hybrid approach - common fields as columns, detailed data in JSONB.
    This allows:
    - Fast queries on common fields (event_type, player, time)
    - Flexibility for event-specific data (trajectory, speed, pressure, etc.)
    """
    __tablename__ = "events"
    
    match_id = Column(UUID(as_uuid=True), ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="SET NULL"), nullable=True)
    
    # Event classification
    event_type = Column(String(100), nullable=False)  # pass, shot, tackle, goal, offside, etc.
    event_subtype = Column(String(100))  # long_pass, header_shot, sliding_tackle, etc.
    
    # Timing
    match_minute = Column(Integer)
    match_second = Column(Float)
    video_timestamp_seconds = Column(Float)
    half = Column(Integer)  # 1, 2, or extra time
    
    # Actors
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"))
    player_id = Column(UUID(as_uuid=True), ForeignKey("players.id", ondelete="SET NULL"))
    secondary_player_id = Column(UUID(as_uuid=True), ForeignKey("players.id", ondelete="SET NULL"))  # Assist, target
    
    # Location (normalized coordinates 0-1)
    location_x = Column(Float)  # Horizontal position
    location_y = Column(Float)  # Vertical position
    location_z = Column(Float)  # Height (for aerial events)
    
    # Event outcome
    outcome = Column(String(50))  # success, failure, neutral
    
    # Detailed event data (JSONB for event-specific attributes)
    # Example for pass: {
    #   "pass_type": "through_ball",
    #   "body_part": "right_foot",
    #   "distance_meters": 28.5,
    #   "speed_kmh": 65.2,
    #   "trajectory": {"start": [0.35, 0.62], "end": [0.72, 0.48]},
    #   "pressure": {"defenders_within_3m": 1, "pressure_score": 0.6}
    # }
    event_data = Column(JSONB, default=dict)
    
    # AI detection metadata
    confidence_score = Column(Float)  # AI confidence (0-1)
    detection_method = Column(String(50), default='ai')  # ai, manual, hybrid
    
    # Verification (human review)
    is_verified = Column("is_verified", sqlalchemy.Boolean, default=False)
    verified_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    verified_at = Column("verified_at", sqlalchemy.DateTime)
    
    # Relationships
    analysis = relationship("Analysis", back_populates="events")
    
    __table_args__ = (
        Index('idx_events_match', 'match_id', postgresql_where=(deleted_at == None)),
        Index('idx_events_type', 'event_type'),
        Index('idx_events_player', 'player_id'),
        Index('idx_events_team', 'team_id'),
        Index('idx_events_minute', 'match_minute'),
        Index('idx_events_analysis', 'analysis_id'),
        Index('idx_events_data', 'event_data', postgresql_using='gin'),  # JSONB index
        CheckConstraint('location_x >= 0 AND location_x <= 1', name='check_location_x'),
        CheckConstraint('location_y >= 0 AND location_y <= 1', name='check_location_y'),
        CheckConstraint('confidence_score >= 0 AND confidence_score <= 1', name='check_event_confidence'),
    )
    
    def __repr__(self) -> str:
        return f"<Event(id={self.id}, type={self.event_type}, minute={self.match_minute})>"


# ============================================================================
# Heatmaps
# ============================================================================

class Heatmap(BaseModel):
    """
    Generated heatmap data.
    
    Design: Stores 2D grid data as JSONB array.
    Pre-computed visualizations can be stored as URLs.
    """
    __tablename__ = "heatmaps"
    
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    match_id = Column(UUID(as_uuid=True), ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    player_id = Column(UUID(as_uuid=True), ForeignKey("players.id", ondelete="SET NULL"))
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="SET NULL"))
    
    # Heatmap type
    heatmap_type = Column(String(100), nullable=False)  # player_position, team_pressure, pass_density
    
    # Time range
    start_minute = Column(Integer)
    end_minute = Column(Integer)
    half = Column(Integer)
    
    # Heatmap data (JSONB 2D array)
    # Example: [[0.1, 0.3, 0.5], [0.2, 0.8, 0.4], ...]
    grid_resolution = Column(String(20))  # "50x50", "100x100"
    heatmap_data = Column(JSONB, nullable=False)
    
    # Statistics
    max_value = Column(Float)
    mean_value = Column(Float)
    total_points = Column(Integer)
    
    # Visualization
    color_scheme = Column(String(50))  # viridis, hot, jet
    visualization_url = Column(String(500))  # Pre-rendered image URL
    
    # Extended metadata
    metadata_ = Column("metadata", JSONB, default=dict)
    
    # Relationships
    analysis = relationship("Analysis", back_populates="heatmaps")
    
    __table_args__ = (
        Index('idx_heatmaps_analysis', 'analysis_id'),
        Index('idx_heatmaps_match', 'match_id'),
        Index('idx_heatmaps_player', 'player_id'),
        Index('idx_heatmaps_team', 'team_id'),
        Index('idx_heatmaps_type', 'heatmap_type'),
    )
    
    def __repr__(self) -> str:
        return f"<Heatmap(id={self.id}, type={self.heatmap_type})>"


# ============================================================================
# Formations
# ============================================================================

class Formation(BaseModel):
    """
    Detected team formations.
    
    Design: Stores formation classification and player positions.
    JSONB used for player positions and tactical analysis.
    """
    __tablename__ = "formations"
    
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    match_id = Column(UUID(as_uuid=True), ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    
    # Formation detection
    formation_name = Column(String(50), nullable=False)  # "4-3-3", "4-4-2", "3-5-2"
    confidence_score = Column(Float)
    
    # Time range
    start_minute = Column(Integer)
    end_minute = Column(Integer)
    duration_minutes = Column(Integer)
    half = Column(Integer)
    
    # Player positions (JSONB array of objects)
    # Example: [
    #   {"player_id": "uuid", "position": "GK", "x": 0.1, "y": 0.5},
    #   {"player_id": "uuid", "position": "CB", "x": 0.2, "y": 0.3}
    # ]
    player_positions = Column(JSONB, nullable=False)
    
    # Formation characteristics
    formation_width = Column(Float)  # Average width of formation
    formation_depth = Column(Float)  # Average depth
    compactness_score = Column(Float)  # How compact the formation is (0-1)
    
    # Tactical insights (AI-generated JSONB)
    # Example: {
    #   "style": {"build_up": "short_passing", "defensive_line": "high"},
    #   "strengths": ["Strong midfield control"],
    #   "weaknesses": ["Vulnerable to counter-attacks"]
    # }
    tactical_analysis = Column(JSONB, default=dict)
    
    # Extended metadata
    metadata_ = Column("metadata", JSONB, default=dict)
    
    # Relationships
    analysis = relationship("Analysis", back_populates="formations")
    
    __table_args__ = (
        Index('idx_formations_analysis', 'analysis_id'),
        Index('idx_formations_match', 'match_id'),
        Index('idx_formations_team', 'team_id'),
        Index('idx_formations_name', 'formation_name'),
        Index('idx_formations_positions', 'player_positions', postgresql_using='gin'),  # JSONB index
        Index('idx_formations_tactical', 'tactical_analysis', postgresql_using='gin'),  # JSONB index
        CheckConstraint('confidence_score >= 0 AND confidence_score <= 1', name='check_formation_confidence'),
    )
    
    def __repr__(self) -> str:
        return f"<Formation(id={self.id}, name={self.formation_name})>"


# ============================================================================
# Query Helpers for AI Analysis
# ============================================================================

def get_pending_analyses(session, limit=10):
    """Get next analyses to process (priority queue)."""
    return session.query(Analysis).filter(
        Analysis.status.in_(['pending', 'queued']),
        Analysis.deleted_at.is_(None)
    ).order_by(
        Analysis.priority.desc(),
        Analysis.created_at
    ).limit(limit).all()


def get_analysis_stats(session, analysis_type=None):
    """Get statistics about analyses."""
    from sqlalchemy import func
    
    query = session.query(
        Analysis.status,
        func.count(Analysis.id).label('count'),
        func.avg(Analysis.processing_duration_seconds).label('avg_duration'),
        func.avg(Analysis.confidence_score).label('avg_confidence')
    ).filter(Analysis.deleted_at.is_(None))
    
    if analysis_type:
        query = query.filter(Analysis.analysis_type == analysis_type)
    
    return query.group_by(Analysis.status).all()


def get_match_events_timeline(session, match_id):
    """Get all events for a match ordered by time."""
    return session.query(Event).filter(
        Event.match_id == match_id,
        Event.deleted_at.is_(None)
    ).order_by(Event.match_minute, Event.match_second).all()


def find_analyses_with_model(session, model_name, model_version=None):
    """Find analyses using a specific AI model."""
    query = session.query(Analysis).filter(
        Analysis.model_name == model_name,
        Analysis.deleted_at.is_(None)
    )
    
    if model_version:
        query = query.filter(Analysis.model_version == model_version)
    
    return query.all()


# Note: Need to import DateTime from sqlalchemy
import sqlalchemy
