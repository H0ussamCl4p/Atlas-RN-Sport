"""
Authentication API routes.

Design: RESTful API following OAuth2 password flow standard.
All endpoints return proper HTTP status codes and error messages.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, verify_refresh_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserResponse,
    TokenResponse,
    TokenRefresh,
    ErrorResponse
)
from app.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "User already exists"},
    }
)
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Register a new user.
    
    Design: Auto-generates tokens after registration for seamless UX.
    Client can immediately start making authenticated requests.
    
    Args:
        user_data: User registration data (email, password, full_name)
        db: Database session (injected)
        
    Returns:
        TokenResponse with access_token and refresh_token
        
    Raises:
        HTTPException 400: If user with email already exists
    """
    auth_service = AuthService(db)
    
    # Check if user already exists
    existing_user = auth_service.user_service.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Register user and generate tokens
    user, access_token, refresh_token = auth_service.register_user(
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
    }
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Login with email and password (OAuth2 password flow).
    
    Design: Uses OAuth2PasswordRequestForm for standard OAuth2 compliance.
    This allows compatibility with OAuth2 clients and tools.
    
    Args:
        form_data: OAuth2 form data (username=email, password)
        db: Database session (injected)
        
    Returns:
        TokenResponse with access_token and refresh_token
        
    Raises:
        HTTPException 401: If credentials are invalid
    """
    auth_service = AuthService(db)
    
    # Authenticate user (username field contains email)
    user, access_token, refresh_token = auth_service.login_user(
        email=form_data.username,
        password=form_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )


@router.post(
    "/refresh",
    response_model=TokenResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Invalid refresh token"},
    }
)
async def refresh_token(
    token_data: TokenRefresh,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Refresh access token using refresh token.
    
    Design: Allows clients to obtain new access tokens without
    requiring user to re-enter credentials.
    
    Args:
        token_data: Refresh token data
        db: Database session (injected)
        
    Returns:
        TokenResponse with new access_token (same refresh_token)
        
    Raises:
        HTTPException 401: If refresh token is invalid
    """
    # Verify refresh token
    payload = verify_refresh_token(token_data.refresh_token)
    
    auth_service = AuthService(db)
    
    # Generate new access token
    new_access_token = auth_service.refresh_access_token(token_data.refresh_token)
    
    if not new_access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not refresh token"
        )
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=token_data.refresh_token,  # Keep same refresh token
        token_type="bearer"
    )


@router.get(
    "/me",
    response_model=UserResponse,
    responses={
        401: {"model": ErrorResponse, "description": "Not authenticated"},
    }
)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
) -> UserResponse:
    """
    Get current authenticated user's information.
    
    Design: Protected route example. Requires valid access token.
    Demonstrates how to use authentication in other endpoints.
    
    Args:
        current_user: Authenticated user (injected from token)
        
    Returns:
        UserResponse with user data
        
    Raises:
        HTTPException 401: If token is invalid or user not found
    """
    # Convert roles string to list for response
    user_dict = {
        **current_user.__dict__,
        "roles": current_user.roles.split(",") if current_user.roles else []
    }
    return UserResponse(**user_dict)

