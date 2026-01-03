"""
User database model.

Design: Contains core user fields for authentication and profile.
Can be extended by other microservices through user_id foreign keys.
"""
from sqlalchemy import Boolean, Column, Integer, String, Index, Text

from app.db.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """
    User model for authentication and profile.
    
    Design decisions:
    - email as unique identifier (common for modern apps)
    - hashed_password stored securely using bcrypt
    - is_active flag allows soft-disable without deletion
    - is_superuser for admin functionality (future-proof)
    - roles stored as comma-separated string for simplicity
    - profile_completed tracks onboarding state
    - Timestamps for auditing
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    organization = Column(String(255), nullable=True)
    level = Column(String(50), nullable=True)
    roles = Column(Text, nullable=True)  # Comma-separated roles
    profile_completed = Column(Boolean, default=False, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    
    # Add database indexes for performance
    __table_args__ = (
        Index('idx_user_email_active', 'email', 'is_active'),
    )
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
