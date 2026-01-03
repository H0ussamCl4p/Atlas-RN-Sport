"""
User management endpoints for profile and role updates.

Security Model:
- All endpoints require authentication (JWT token)
- Role assignment is restricted to: coach, analyst
- Admin role can ONLY be assigned manually (DB/script)
- Users cannot escalate their own privileges
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, RoleUpdate, ProfileUpdate
from app.services.user_service import UserService

router = APIRouter()

# Security: Whitelist of roles users can self-assign during onboarding
ASSIGNABLE_ROLES = {"coach", "analyst"}


@router.post("/role", response_model=UserResponse)
def update_user_role(
    role_data: RoleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update user's primary role during onboarding.
    
    Security Rules:
    - Only authenticated users can call this
    - Users can only assign: coach, analyst
    - Admin role is rejected (must be assigned manually)
    - Role can only be set once (no re-assignment)
    
    Args:
        role_data: Role selection payload
        current_user: Authenticated user from JWT
        db: Database session
        
    Returns:
        Updated user with new role
        
    Raises:
        HTTPException 403: If role is not assignable
        HTTPException 409: If role already assigned
    """
    user_service = UserService(db)
    
    # Security Check 1: Prevent admin role assignment via API
    if role_data.role.lower() not in ASSIGNABLE_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Role '{role_data.role}' cannot be self-assigned. Only {', '.join(ASSIGNABLE_ROLES)} are allowed."
        )
    
    # Security Check 2: Prevent role reassignment (no escalation)
    if current_user.roles:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Role already assigned. Cannot change role once set."
        )
    
    # Update the user's role
    current_user.roles = role_data.role.lower()
    db.commit()
    db.refresh(current_user)
    
    # Convert roles string to list for response
    user_dict = {
        **current_user.__dict__,
        "roles": current_user.roles.split(",") if current_user.roles else []
    }
    
    return UserResponse(**user_dict)


@router.post("/profile", response_model=UserResponse)
def update_user_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Complete user profile during onboarding.
    
    Security Rules:
    - Only authenticated users can call this
    - Users can only update their own profile
    
    Sets profile fields and marks profile as completed.
    
    Args:
        profile_data: Profile completion payload
        current_user: Authenticated user from JWT
        db: Database session
        
    Returns:
        Updated user with completed profile
    """
    user_service = UserService(db)
    
    # Update profile fields
    current_user.first_name = profile_data.first_name
    current_user.last_name = profile_data.last_name
    current_user.organization = profile_data.organization
    current_user.level = profile_data.level
    current_user.profile_completed = True
    
    # Update full_name for convenience
    current_user.full_name = f"{profile_data.first_name} {profile_data.last_name}"
    
    db.commit()
    db.refresh(current_user)
    
    # Convert roles string to list for response
    user_dict = {
        **current_user.__dict__,
        "roles": current_user.roles.split(",") if current_user.roles else []
    }
    
    return UserResponse(**user_dict)
