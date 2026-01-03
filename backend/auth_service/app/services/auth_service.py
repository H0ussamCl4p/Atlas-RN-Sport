"""
Authentication service - Business logic for auth operations.

Design: Handles token generation and validation logic.
Separated from user service for single responsibility principle.
"""
from datetime import timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.models.user import User
from app.services.user_service import UserService


class AuthService:
    """
    Service class for authentication operations.
    
    Design: Orchestrates authentication flow including token generation
    and user validation.
    """
    
    def __init__(self, db: Session):
        """
        Initialize service with database session.
        
        Args:
            db: SQLAlchemy database session
        """
        self.db = db
        self.user_service = UserService(db)
    
    def register_user(
        self,
        email: str,
        password: str,
        full_name: Optional[str] = None
    ) -> tuple[User, str, str]:
        """
        Register a new user and generate tokens.
        
        Design: Combines user creation and token generation in one
        operation for better UX (auto-login after registration).
        
        Args:
            email: User's email address
            password: Plain-text password
            full_name: User's full name (optional)
            
        Returns:
            Tuple of (User, access_token, refresh_token)
        """
        # Create user
        user = self.user_service.create_user(
            email=email,
            password=password,
            full_name=full_name
        )
        
        # Generate tokens
        access_token = self._generate_access_token(user)
        refresh_token = self._generate_refresh_token(user)
        
        return user, access_token, refresh_token
    
    def login_user(self, email: str, password: str) -> tuple[Optional[User], Optional[str], Optional[str]]:
        """
        Authenticate user and generate tokens.
        
        Args:
            email: User's email address
            password: Plain-text password
            
        Returns:
            Tuple of (User, access_token, refresh_token) if valid,
            (None, None, None) if invalid credentials
        """
        # Authenticate user
        user = self.user_service.authenticate_user(email, password)
        
        if not user:
            return None, None, None
        
        # Check if user is active
        if not user.is_active:
            return None, None, None
        
        # Generate tokens
        access_token = self._generate_access_token(user)
        refresh_token = self._generate_refresh_token(user)
        
        return user, access_token, refresh_token
    
    def refresh_access_token(self, refresh_token: str) -> Optional[str]:
        """
        Generate new access token from refresh token.
        
        Design: Allows clients to obtain new access tokens without
        re-authenticating, improving UX.
        
        Args:
            refresh_token: Valid refresh token
            
        Returns:
            New access token if refresh token is valid, None otherwise
        """
        # Decode refresh token
        payload = decode_token(refresh_token)
        
        if not payload or payload.get("type") != "refresh":
            return None
        
        # Extract user_id
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        # Verify user exists and is active
        user = self.user_service.get_user_by_id(int(user_id))
        if not user or not user.is_active:
            return None
        
        # Generate new access token
        return self._generate_access_token(user)
    
    def _generate_access_token(self, user: User) -> str:
        """
        Generate access token for user.
        
        Design: Includes minimal claims (user_id, email) to keep token size small.
        
        Args:
            user: User object
            
        Returns:
            JWT access token
        """
        token_data = {
            "sub": str(user.id),
            "email": user.email
        }
        
        return create_access_token(
            data=token_data,
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
    
    def _generate_refresh_token(self, user: User) -> str:
        """
        Generate refresh token for user.
        
        Args:
            user: User object
            
        Returns:
            JWT refresh token
        """
        token_data = {
            "sub": str(user.id)
        }
        
        return create_refresh_token(data=token_data)
