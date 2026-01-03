"""
User service layer - Business logic for user operations.

Design: Service layer pattern separates business logic from API routes.
This makes the code testable and reusable across different endpoints.
"""
from typing import Optional

from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User


class UserService:
    """
    Service class for user-related operations.
    
    Design: All database operations go through this service layer.
    This provides a clean separation between API routes and data access.
    """
    
    def __init__(self, db: Session):
        """
        Initialize service with database session.
        
        Args:
            db: SQLAlchemy database session
        """
        self.db = db
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """
        Retrieve user by ID.
        
        Args:
            user_id: User's primary key
            
        Returns:
            User object if found, None otherwise
        """
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Retrieve user by email address.
        
        Args:
            email: User's email address
            
        Returns:
            User object if found, None otherwise
        """
        return self.db.query(User).filter(User.email == email).first()
    
    def create_user(
        self,
        email: str,
        password: str,
        full_name: Optional[str] = None,
        is_superuser: bool = False
    ) -> User:
        """
        Create a new user with hashed password.
        
        Design: Password is hashed before storage. Plain-text passwords
        are never stored in the database.
        
        Args:
            email: User's email address
            password: Plain-text password (will be hashed)
            full_name: User's full name (optional)
            is_superuser: Whether user has admin privileges
            
        Returns:
            Newly created User object
        """
        hashed_password = hash_password(password)
        
        db_user = User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            is_superuser=is_superuser,
            is_active=True
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        return db_user
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate user with email and password.
        
        Design: Uses constant-time password comparison to prevent
        timing attacks.
        
        Args:
            email: User's email address
            password: Plain-text password
            
        Returns:
            User object if credentials are valid, None otherwise
        """
        user = self.get_user_by_email(email)
        
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        return user
    
    def update_user(
        self,
        user_id: int,
        email: Optional[str] = None,
        full_name: Optional[str] = None,
        password: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> Optional[User]:
        """
        Update user information.
        
        Args:
            user_id: User's primary key
            email: New email (optional)
            full_name: New full name (optional)
            password: New password (optional, will be hashed)
            is_active: New active status (optional)
            
        Returns:
            Updated User object if found, None otherwise
        """
        user = self.get_user_by_id(user_id)
        
        if not user:
            return None
        
        if email is not None:
            user.email = email
        if full_name is not None:
            user.full_name = full_name
        if password is not None:
            user.hashed_password = hash_password(password)
        if is_active is not None:
            user.is_active = is_active
        
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def delete_user(self, user_id: int) -> bool:
        """
        Delete user by ID.
        
        Design: Hard delete. For production, consider soft-delete
        (setting is_active=False) to maintain audit trail.
        
        Args:
            user_id: User's primary key
            
        Returns:
            True if user was deleted, False if user not found
        """
        user = self.get_user_by_id(user_id)
        
        if not user:
            return False
        
        self.db.delete(user)
        self.db.commit()
        
        return True
    
    def list_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        """
        List users with pagination.
        
        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of User objects
        """
        return self.db.query(User).offset(skip).limit(limit).all()
