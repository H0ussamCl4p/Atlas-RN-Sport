"""
Atlas AI Service Configuration
"""
import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Service
    SERVICE_NAME: str = "ai_service"
    SERVICE_VERSION: str = "1.0.0"
    HOST: str = "0.0.0.0"
    PORT: int = 8002
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = "sqlite:///./atlas_dev.db"
    
    # API Keys
    ROBOFLOW_API_KEY: str = ""
    
    # Storage
    UPLOAD_FOLDER: str = "./uploads"
    MAX_VIDEO_SIZE_MB: int = 500
    
    # Models
    MODEL_PATH: str = "./models/best_model.pth"
    
    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-here"
    JWT_ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # Auth Service
    AUTH_SERVICE_URL: str = "http://localhost:8001"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
