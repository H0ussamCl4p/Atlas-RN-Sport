"""
Database session management and connection handling.

Design: Uses dependency injection pattern to provide database sessions
to route handlers. Sessions are automatically closed after each request.
"""
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings


# Create database engine
# For SQLite (dev): Uses a local file database
# For PostgreSQL (prod): Configure connection pooling for performance
if settings.DATABASE_URL.startswith("sqlite"):
    # SQLite-specific configuration
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},  # Allow multi-threading
        echo=settings.DEBUG  # Log SQL statements in debug mode
    )
else:
    # PostgreSQL configuration with connection pooling
    engine = create_engine(
        settings.DATABASE_URL,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
        pool_timeout=settings.DB_POOL_TIMEOUT,
        pool_pre_ping=True,  # Verify connections before using
        echo=settings.DEBUG
    )


# Session factory
# Each request gets its own session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to provide database sessions to route handlers.
    
    Design: FastAPI's dependency injection system ensures the session
    is properly closed even if an exception occurs during request handling.
    
    Yields:
        SQLAlchemy Session object
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """
    Initialize the database by creating all tables.
    
    Design: Called at application startup. In production, use Alembic
    for database migrations instead of this method.
    """
    from app.db.base import Base
    from app.models.user import User  # Import all models here to ensure they're registered
    
    Base.metadata.create_all(bind=engine)
