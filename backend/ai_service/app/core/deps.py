"""
Dependencies for API endpoints
"""
from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
import sys
from pathlib import Path

# Add parent directory to path for shared imports
sys.path.append(str(Path(__file__).parent.parent.parent.parent))

from backend.shared.models.base import SessionLocal
from app.core.config import settings


security = HTTPBearer()


def get_db() -> Generator:
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Get current user from JWT token.
    
    Note: This is a simplified version. In production, you'd want to:
    1. Verify token signature with auth service
    2. Cache user data
    3. Handle token expiration properly
    """
    token = credentials.credentials
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET_KEY, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        
        # Create a simple user object with just the ID
        # In production, fetch full user from database or auth service
        class SimpleUser:
            def __init__(self, id: str):
                self.id = id
        
        return SimpleUser(id=user_id)
        
    except JWTError:
        raise credentials_exception
