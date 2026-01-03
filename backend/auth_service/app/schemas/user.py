"""
Pydantic schemas for request/response validation.

Design: Separation of concerns - schemas define the API contract,
models define the database structure. This allows for flexibility
in what data is exposed vs stored.
"""
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


# ============================================================================
# Base schemas
# ============================================================================

class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr
    full_name: Optional[str] = None


# ============================================================================
# Request schemas (input validation)
# ============================================================================

class UserRegister(UserBase):
    """Schema for user registration endpoint."""
    password: str = Field(..., min_length=8, max_length=100)
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "coach@atlas.com",
                "full_name": "John Doe",
                "password": "securepassword123"
            }
        }
    )


class UserLogin(BaseModel):
    """Schema for user login endpoint (OAuth2 password flow)."""
    username: EmailStr  # OAuth2 spec uses 'username' field
    password: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "username": "coach@atlas.com",
                "password": "securepassword123"
            }
        }
    )


class TokenRefresh(BaseModel):
    """Schema for token refresh endpoint."""
    refresh_token: str


# ============================================================================
# Response schemas (data returned to client)
# ============================================================================

class UserResponse(UserBase):
    """
    User response schema.
    
    Design: Excludes sensitive fields like hashed_password.
    Only returns data that should be visible to the client.
    """
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    organization: Optional[str] = None
    level: Optional[str] = None
    roles: List[str] = []
    profile_completed: bool = False
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """
    Token response schema.
    
    Design: Returns both access and refresh tokens.
    - access_token: Short-lived, used for API requests
    - refresh_token: Long-lived, used to obtain new access tokens
    """
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }
    )


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "message": "Operation completed successfully"
            }
        }
    )


# ============================================================================
# Error schemas
# ============================================================================

class ErrorResponse(BaseModel):
    """Standard error response schema."""
    detail: str
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "detail": "User with this email already exists"
            }
        }
    )


# ============================================================================
# Onboarding schemas
# ============================================================================

class RoleUpdate(BaseModel):
    """
    Schema for updating user role during onboarding.
    
    Security: Enforces whitelist of assignable roles at the validation layer.
    This provides defense-in-depth alongside endpoint validation.
    """
    role: str = Field(..., min_length=1, pattern="^(coach|analyst)$")
    
    @field_validator('role')
    @classmethod
    def validate_role(cls, v: str) -> str:
        """
        Security validator: Only allow coach and analyst roles.
        
        Admin role must be assigned manually via database or admin scripts.
        This prevents privilege escalation attacks.
        """
        allowed_roles = {"coach", "analyst"}
        role_lower = v.lower()
        
        if role_lower not in allowed_roles:
            raise ValueError(
                f"Invalid role. Only {', '.join(allowed_roles)} are allowed. "
                f"Admin privileges must be assigned manually."
            )
        
        return role_lower
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "role": "coach"
            }
        }
    )


class ProfileUpdate(BaseModel):
    """
    Schema for completing user profile during onboarding.
    
    Validates all required profile fields with proper constraints.
    """
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    organization: str = Field(..., min_length=1, max_length=255)
    level: str = Field(..., min_length=1, max_length=50, pattern="^(amateur|semi-pro|pro)$")
    
    @field_validator('level')
    @classmethod
    def validate_level(cls, v: str) -> str:
        """Validate that level is one of the allowed values."""
        allowed_levels = {"amateur", "semi-pro", "pro"}
        level_lower = v.lower()
        
        if level_lower not in allowed_levels:
            raise ValueError(
                f"Invalid level. Must be one of: {', '.join(allowed_levels)}"
            )
        
        return level_lower
    
    @field_validator('first_name', 'last_name', 'organization')
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        """Strip leading/trailing whitespace from text fields."""
        return v.strip()
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "first_name": "Jean",
                "last_name": "Dupont",
                "organization": "FC Exemple",
                "level": "pro"
            }
        }
    )
