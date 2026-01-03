"""
Core configuration management using environment variables.
Supports multiple environments (dev, staging, production).
"""
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Uses Pydantic for validation and type safety.
    """
    # Application metadata
    APP_NAME: str = "Atlas Authentication Service"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"  # development, staging, production
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str  # REQUIRED: Used for JWT signing - MUST be set in .env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 minutes
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # 7 days
    
    # CORS settings for frontend communication
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",  # React dev server
        "http://localhost:3000",
        "http://localhost:8080",
        "http://10.33.212.190:5173",  # Network access
        "http://192.168.56.1:5173",   # Network access
        "http://192.168.137.1:5173",  # Network access
        "http://172.22.224.1:5173",   # Network access
    ]
    
    # Database configuration
    # Defaults to SQLite for development, override with PostgreSQL URL in production
    DATABASE_URL: str = "sqlite:///./auth_service.db"
    # Production example: "postgresql://user:password@localhost:5432/atlas_auth"
    
    # Database connection pool settings (for production PostgreSQL)
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    
    # Logging
    LOG_LEVEL: str = "INFO"  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Singleton instance of settings
settings = Settings()


def get_settings() -> Settings:
    """
    Dependency function for FastAPI to inject settings.
    Allows for easy testing and configuration overrides.
    """
    return settings
