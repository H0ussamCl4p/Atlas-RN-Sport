"""
Database base model and common functionality.
All SQLAlchemy models inherit from Base.
"""
from datetime import datetime

from sqlalchemy import Column, DateTime
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class TimestampMixin:
    """
    Mixin to add timestamp fields to models.
    
    Design: Every entity should track when it was created and last updated
    for auditing and debugging purposes.
    """
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
