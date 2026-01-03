"""
Dependency injection functions for FastAPI routes.
These functions provide reusable dependencies for authentication and database access.
"""
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token, verify_token_type
from app.db.session import get_db
from app.models.user import User
from app.services.user_service import UserService


# OAuth2 scheme for token extraction from Authorization header
# tokenUrl is the endpoint where clients can obtain tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to extract and validate the current authenticated user from JWT.
    
    Design: This is the main authentication dependency used on protected routes.
    It extracts the token, validates it, and returns the user object.
    
    Args:
        token: JWT token extracted from Authorization header
        db: Database session
        
    Returns:
        Authenticated User object
        
    Raises:
        HTTPException 401: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode token
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    
    # Verify it's an access token (not a refresh token)
    if not verify_token_type(payload, "access"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Extract user_id from token
    user_id: Optional[int] = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Retrieve user from database
    user_service = UserService(db)
    user = user_service.get_user_by_id(int(user_id))
    
    if user is None:
        raise credentials_exception
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Dependency to ensure user is active.
    
    Design: Additional layer for routes that require active users only.
    This is already checked in get_current_user, but kept as separate
    dependency for explicit semantics and future extensibility.
    
    Args:
        current_user: User from get_current_user dependency
        
    Returns:
        Active User object
    """
    return current_user


def verify_refresh_token(token: str) -> dict:
    """
    Verify and decode a refresh token.
    
    Args:
        token: JWT refresh token
        
    Returns:
        Decoded token payload
        
    Raises:
        HTTPException 401: If token is invalid or not a refresh token
    """
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    if not verify_token_type(payload, "refresh"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is not a refresh token"
        )
    
    return payload
