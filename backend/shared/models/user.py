"""
User domain models for authentication and authorization.

Design: Complete RBAC (Role-Based Access Control) implementation.
Compatible with existing auth_service, but adds profiles and permissions.
"""
from sqlalchemy import Boolean, Column, String, ForeignKey, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from backend.shared.models.base import SoftDeleteModel, BaseModel, get_json_type


# ============================================================================
# Core User Model (Auth-compatible)
# ============================================================================

class User(SoftDeleteModel):
    """
    Core user model for authentication.
    
    Design: Minimal authentication data only. Non-auth data goes in UserProfile.
    This keeps authentication fast and focused.
    
    Compatible with existing auth_service User model.
    """
    __tablename__ = "users"
    
    # Authentication
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    
    # Account status
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    
    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    user_roles = relationship("UserRole", back_populates="user", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index('idx_users_email_active', 'email', 'is_active', postgresql_where=(deleted_at == None)),
        Index('idx_users_active', 'is_active', postgresql_where=(deleted_at == None)),
    )
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
    
    @property
    def roles(self):
        """Get list of role names for this user."""
        return [ur.role.name for ur in self.user_roles if ur.role]
    
    def has_role(self, role_name: str) -> bool:
        """Check if user has a specific role."""
        return role_name in self.roles
    
    def has_permission(self, resource: str, action: str) -> bool:
        """Check if user has a specific permission through their roles."""
        for user_role in self.user_roles:
            if user_role.role:
                for role_perm in user_role.role.role_permissions:
                    perm = role_perm.permission
                    if perm.resource == resource and perm.action == action:
                        return True
        return self.is_superuser  # Superusers have all permissions


# ============================================================================
# User Profile (Extended Information)
# ============================================================================

class UserProfile(BaseModel):
    """
    Extended user information (non-authentication data).
    
    Design: Separates auth data from profile data for:
    - Faster auth queries
    - Optional profile completion
    - Easier to extend without touching auth
    """
    __tablename__ = "user_profiles"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Personal information
    full_name = Column(String(255))
    organization = Column(String(255))
    role_in_org = Column(String(100))  # Coach, Analyst, Scout, etc.
    
    # Media
    avatar_url = Column(String(500))
    
    # Preferences (JSONB for flexibility)
    # Example: {"theme": "dark", "language": "en", "notifications": {"email": true}}
    preferences = Column(JSONB, default=dict)
    
    # Extensible metadata
    # Example: {"linkedin": "url", "certifications": [...], "expertise": [...]}
    metadata = Column(JSONB, default=dict)
    
    # Relationships
    user = relationship("User", back_populates="profile")
    
    # Indexes
    __table_args__ = (
        Index('idx_user_profiles_user_id', 'user_id'),
        Index('idx_user_profiles_organization', 'organization'),
    )
    
    def __repr__(self) -> str:
        return f"<UserProfile(user_id={self.user_id}, full_name={self.full_name})>"


# ============================================================================
# RBAC: Roles
# ============================================================================

class Role(BaseModel):
    """
    Role definition for RBAC.
    
    Design: Roles group permissions. Users are assigned roles.
    Examples: admin, coach, analyst, viewer
    """
    __tablename__ = "roles"
    
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(500))
    is_system_role = Column(Boolean, default=False, nullable=False)  # Prevents deletion
    
    # Relationships
    user_roles = relationship("UserRole", back_populates="role", cascade="all, delete-orphan")
    role_permissions = relationship("RolePermission", back_populates="role", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_roles_name', 'name'),
    )
    
    def __repr__(self) -> str:
        return f"<Role(name={self.name})>"
    
    @property
    def permissions(self):
        """Get list of permissions for this role."""
        return [rp.permission for rp in self.role_permissions if rp.permission]
    
    def has_permission(self, resource: str, action: str) -> bool:
        """Check if role has a specific permission."""
        for role_perm in self.role_permissions:
            perm = role_perm.permission
            if perm.resource == resource and perm.action == action:
                return True
        return False


# ============================================================================
# RBAC: Permissions
# ============================================================================

class Permission(BaseModel):
    """
    Permission definition for RBAC.
    
    Design: Granular permissions following resource:action pattern.
    Examples:
    - analyses:create
    - videos:delete
    - teams:read
    - reports:execute
    """
    __tablename__ = "permissions"
    
    name = Column(String(100), unique=True, nullable=False)  # Composite name: resource.action
    resource = Column(String(50), nullable=False)  # analyses, videos, teams, etc.
    action = Column(String(50), nullable=False)  # create, read, update, delete, execute
    description = Column(String(500))
    
    # Relationships
    role_permissions = relationship("RolePermission", back_populates="permission", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_permissions_resource_action', 'resource', 'action'),
        Index('idx_permissions_name', 'name'),
    )
    
    def __repr__(self) -> str:
        return f"<Permission(name={self.name})>"


# ============================================================================
# RBAC: Many-to-Many Relationships
# ============================================================================

class UserRole(BaseModel):
    """
    Many-to-many relationship: Users <-> Roles
    
    Design: Tracks who assigned the role and when for auditing.
    """
    __tablename__ = "user_roles"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    
    # Audit trail
    assigned_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="user_roles", foreign_keys=[user_id])
    role = relationship("Role", back_populates="user_roles")
    assigner = relationship("User", foreign_keys=[assigned_by])
    
    __table_args__ = (
        Index('idx_user_roles_user', 'user_id'),
        Index('idx_user_roles_role', 'role_id'),
        CheckConstraint('user_id != assigned_by', name='check_user_cannot_assign_to_self'),
    )
    
    def __repr__(self) -> str:
        return f"<UserRole(user_id={self.user_id}, role_id={self.role_id})>"


class RolePermission(BaseModel):
    """
    Many-to-many relationship: Roles <-> Permissions
    
    Design: Defines what each role can do.
    """
    __tablename__ = "role_permissions"
    
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    permission_id = Column(UUID(as_uuid=True), ForeignKey("permissions.id", ondelete="CASCADE"), nullable=False)
    
    # Relationships
    role = relationship("Role", back_populates="role_permissions")
    permission = relationship("Permission", back_populates="role_permissions")
    
    __table_args__ = (
        Index('idx_role_permissions_role', 'role_id'),
        Index('idx_role_permissions_permission', 'permission_id'),
    )
    
    def __repr__(self) -> str:
        return f"<RolePermission(role_id={self.role_id}, permission_id={self.permission_id})>"


# ============================================================================
# Seed Data Helper
# ============================================================================

def seed_rbac_data(session):
    """
    Seed initial RBAC data (roles and permissions).
    
    Design: Creates standard roles and permissions for the platform.
    Should be run once during initial setup.
    """
    from datetime import datetime
    
    # Define permissions
    permissions_data = [
        # Analyses
        {"name": "analyses.create", "resource": "analyses", "action": "create", "description": "Create new analyses"},
        {"name": "analyses.read", "resource": "analyses", "action": "read", "description": "View analyses"},
        {"name": "analyses.update", "resource": "analyses", "action": "update", "description": "Update analyses"},
        {"name": "analyses.delete", "resource": "analyses", "action": "delete", "description": "Delete analyses"},
        
        # Videos
        {"name": "videos.upload", "resource": "videos", "action": "upload", "description": "Upload videos"},
        {"name": "videos.read", "resource": "videos", "action": "read", "description": "View videos"},
        {"name": "videos.delete", "resource": "videos", "action": "delete", "description": "Delete videos"},
        
        # Teams
        {"name": "teams.create", "resource": "teams", "action": "create", "description": "Create teams"},
        {"name": "teams.read", "resource": "teams", "action": "read", "description": "View teams"},
        {"name": "teams.update", "resource": "teams", "action": "update", "description": "Update teams"},
        {"name": "teams.delete", "resource": "teams", "action": "delete", "description": "Delete teams"},
        
        # Players
        {"name": "players.create", "resource": "players", "action": "create", "description": "Create players"},
        {"name": "players.read", "resource": "players", "action": "read", "description": "View players"},
        {"name": "players.update", "resource": "players", "action": "update", "description": "Update players"},
        {"name": "players.delete", "resource": "players", "action": "delete", "description": "Delete players"},
        
        # Users (admin only)
        {"name": "users.create", "resource": "users", "action": "create", "description": "Create users"},
        {"name": "users.read", "resource": "users", "action": "read", "description": "View users"},
        {"name": "users.update", "resource": "users", "action": "update", "description": "Update users"},
        {"name": "users.delete", "resource": "users", "action": "delete", "description": "Delete users"},
    ]
    
    # Create permissions
    permissions = {}
    for perm_data in permissions_data:
        perm = Permission(**perm_data)
        session.add(perm)
        permissions[perm_data["name"]] = perm
    
    session.flush()  # Get IDs
    
    # Define roles with their permissions
    roles_data = [
        {
            "name": "admin",
            "description": "Full system access",
            "is_system_role": True,
            "permissions": list(permissions.keys())  # All permissions
        },
        {
            "name": "coach",
            "description": "Coach with analysis and team management access",
            "is_system_role": True,
            "permissions": [
                "analyses.create", "analyses.read", "analyses.update",
                "videos.upload", "videos.read",
                "teams.read", "teams.update",
                "players.read", "players.update"
            ]
        },
        {
            "name": "analyst",
            "description": "Analyst with read and analysis access",
            "is_system_role": True,
            "permissions": [
                "analyses.create", "analyses.read",
                "videos.read",
                "teams.read",
                "players.read"
            ]
        },
        {
            "name": "viewer",
            "description": "Read-only access",
            "is_system_role": True,
            "permissions": [
                "analyses.read",
                "videos.read",
                "teams.read",
                "players.read"
            ]
        }
    ]
    
    # Create roles and assign permissions
    for role_data in roles_data:
        perm_names = role_data.pop("permissions")
        role = Role(**role_data)
        session.add(role)
        session.flush()  # Get role ID
        
        # Assign permissions to role
        for perm_name in perm_names:
            if perm_name in permissions:
                role_perm = RolePermission(
                    role_id=role.id,
                    permission_id=permissions[perm_name].id
                )
                session.add(role_perm)
    
    session.commit()
    print("✓ RBAC data seeded successfully")
