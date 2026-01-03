"""
Base database models and mixins for Atlas platform.

Design: Shared across all microservices for consistency.
Each service imports these base classes for their domain models.
"""
import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import Column, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from sqlalchemy.orm import DeclarativeBase


# ============================================================================
# Base Model
# ============================================================================

class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy models.
    
    Design: Uses DeclarativeBase from SQLAlchemy 2.0+ for better type hints.
    """
    pass


# ============================================================================
# Mixins
# ============================================================================

class UUIDMixin:
    """
    Mixin to add UUID primary key.
    
    Design: UUIDs provide:
    - Globally unique identifiers (no collision across services)
    - No sequential guessing (security)
    - Safe for distributed systems
    - Mergeable databases
    """
    
    @declared_attr
    def id(cls) -> Column:
        return Column(
            UUID(as_uuid=True),
            primary_key=True,
            default=uuid.uuid4,
            nullable=False,
            doc="UUID primary key"
        )


class TimestampMixin:
    """
    Mixin to add created_at and updated_at timestamps.
    
    Design: Every entity should track creation and modification times
    for auditing, debugging, and data lineage.
    """
    
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        doc="UTC timestamp when record was created"
    )
    
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
        doc="UTC timestamp when record was last updated"
    )


class SoftDeleteMixin:
    """
    Mixin to add soft delete functionality.
    
    Design: Instead of hard deleting records, we mark them as deleted
    by setting deleted_at timestamp. This:
    - Preserves data for auditing
    - Allows recovery from accidental deletions
    - Maintains referential integrity
    - Enables historical analysis
    
    Usage:
        # Soft delete
        record.deleted_at = datetime.utcnow()
        
        # Query active records only
        query.filter(Model.deleted_at.is_(None))
        
        # Include deleted records
        query  # Don't filter on deleted_at
    """
    
    deleted_at = Column(
        DateTime,
        nullable=True,
        default=None,
        doc="UTC timestamp when record was soft-deleted (NULL if active)"
    )
    
    @property
    def is_deleted(self) -> bool:
        """Check if record is soft-deleted."""
        return self.deleted_at is not None
    
    def soft_delete(self) -> None:
        """Soft delete this record."""
        self.deleted_at = datetime.utcnow()
    
    def restore(self) -> None:
        """Restore a soft-deleted record."""
        self.deleted_at = None


class MetadataMixin:
    """
    Mixin to add flexible JSONB metadata field.
    
    Design: Provides extensibility without schema migrations.
    Use for non-critical, optional, or rapidly evolving data.
    
    WARNING: Don't abuse this. Keep structured data in proper columns.
    Use metadata for:
    - Optional extended attributes
    - Integration-specific data
    - Experimental fields
    - External system references
    """
    
    @declared_attr
    def metadata_(cls) -> Column:
        # Note: Named metadata_ to avoid conflict with SQLAlchemy's MetaData
        return Column(
            "metadata",  # Actual column name in database
            JSONB,
            nullable=True,
            default=dict,
            doc="Flexible JSONB field for extended attributes"
        )


# ============================================================================
# Combined Base Models
# ============================================================================

class BaseModel(Base, UUIDMixin, TimestampMixin):
    """
    Standard base model with UUID and timestamps.
    
    Use for: Most domain entities
    """
    __abstract__ = True


class SoftDeleteModel(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    Base model with UUID, timestamps, and soft delete.
    
    Use for: Entities that should never be hard-deleted
    (users, teams, matches, etc.)
    """
    __abstract__ = True


class ExtendedModel(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin, MetadataMixin):
    """
    Full-featured base model with all mixins.
    
    Use for: Entities needing maximum flexibility
    """
    __abstract__ = True


# ============================================================================
# JSONB Type Helpers (for SQLite compatibility)
# ============================================================================

def get_json_type(dialect_name: str):
    """
    Get appropriate JSON type for database dialect.
    
    Design: Allows same models to work with PostgreSQL and SQLite.
    - PostgreSQL: Use JSONB (binary JSON, indexed, fast)
    - SQLite: Use JSON (text-based)
    
    Args:
        dialect_name: Database dialect ('postgresql', 'sqlite', etc.)
        
    Returns:
        Appropriate JSON column type
    """
    if dialect_name == 'postgresql':
        from sqlalchemy.dialects.postgresql import JSONB
        return JSONB
    else:
        from sqlalchemy import JSON
        return JSON


# ============================================================================
# Query Helpers
# ============================================================================

class ActiveRecordQuery:
    """
    Query helper for filtering out soft-deleted records.
    
    Usage:
        # In your model
        class User(SoftDeleteModel):
            __tablename__ = "users"
            
            @classmethod
            def active(cls, session):
                return session.query(cls).filter(cls.deleted_at.is_(None))
        
        # Query
        active_users = User.active(db).all()
    """
    
    @classmethod
    def active(cls, session):
        """Get query for active (non-deleted) records."""
        return session.query(cls).filter(cls.deleted_at.is_(None))
    
    @classmethod
    def deleted(cls, session):
        """Get query for deleted records."""
        return session.query(cls).filter(cls.deleted_at.isnot(None))
    
    @classmethod
    def all_including_deleted(cls, session):
        """Get query for all records (including deleted)."""
        return session.query(cls)


# ============================================================================
# Database Session Helpers
# ============================================================================

def create_soft_delete_filter(model_class):
    """
    Create a filter function that automatically excludes soft-deleted records.
    
    Usage in SQLAlchemy event listeners to make all queries exclude
    soft-deleted records by default.
    """
    from sqlalchemy import event
    from sqlalchemy.orm import Session
    
    @event.listens_for(Session, "do_orm_execute")
    def receive_do_orm_execute(orm_execute_state):
        if (
            orm_execute_state.is_select
            and not orm_execute_state.is_column_load
            and not orm_execute_state.is_relationship_load
        ):
            orm_execute_state.statement = orm_execute_state.statement.filter(
                model_class.deleted_at.is_(None)
            )


# ============================================================================
# Model Serialization Helpers
# ============================================================================

class SerializableMixin:
    """
    Mixin to add serialization methods to models.
    
    Design: Converts SQLAlchemy models to dictionaries for JSON responses.
    """
    
    def to_dict(self, include: list[str] = None, exclude: list[str] = None) -> dict[str, Any]:
        """
        Convert model to dictionary.
        
        Args:
            include: List of fields to include (if None, include all)
            exclude: List of fields to exclude
            
        Returns:
            Dictionary representation of model
        """
        data = {}
        
        for column in self.__table__.columns:
            if include and column.name not in include:
                continue
            if exclude and column.name in exclude:
                continue
            
            value = getattr(self, column.name)
            
            # Handle UUIDs
            if isinstance(value, uuid.UUID):
                value = str(value)
            # Handle datetimes
            elif isinstance(value, datetime):
                value = value.isoformat()
            
            data[column.name] = value
        
        return data
    
    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> 'SerializableMixin':
        """
        Create model instance from dictionary.
        
        Args:
            data: Dictionary of model attributes
            
        Returns:
            Model instance
        """
        # Filter out keys that don't correspond to columns
        valid_keys = {column.name for column in cls.__table__.columns}
        filtered_data = {k: v for k, v in data.items() if k in valid_keys}
        
        return cls(**filtered_data)


# ============================================================================
# Example Usage
# ============================================================================

"""
# Example 1: Simple model with UUID and timestamps
class Team(BaseModel):
    __tablename__ = "teams"
    
    name = Column(String(255), nullable=False)
    country = Column(String(100))

# Example 2: Model with soft delete
class User(SoftDeleteModel):
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

# Example 3: Model with all features + serialization
class Analysis(ExtendedModel, SerializableMixin, ActiveRecordQuery):
    __tablename__ = "analyses"
    
    match_id = Column(UUID(as_uuid=True), ForeignKey("matches.id"))
    analysis_type = Column(String(100), nullable=False)
    status = Column(String(50), default="pending")
    output_data = Column(JSONB)

# Usage
analysis = Analysis(
    match_id=match_uuid,
    analysis_type="player_tracking",
    status="pending"
)

# Query active analyses
active_analyses = Analysis.active(db).all()

# Serialize
analysis_dict = analysis.to_dict(exclude=["deleted_at"])
"""
