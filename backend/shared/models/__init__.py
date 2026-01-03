"""
Atlas shared database models.

Import all models here for easy access and migration discovery.
"""

# Base models and mixins
from backend.shared.models.base import (
    Base,
    BaseModel,
    SoftDeleteModel,
    ExtendedModel,
    UUIDMixin,
    TimestampMixin,
    SoftDeleteMixin,
    MetadataMixin,
    SerializableMixin,
    ActiveRecordQuery,
    get_json_type
)

# User domain
from backend.shared.models.user import (
    User,
    UserProfile,
    Role,
    Permission,
    UserRole,
    RolePermission,
    seed_rbac_data
)

# Core domain
from backend.shared.models.core import (
    Team,
    Player,
    Season,
    Match,
    PlayerMatchStats,
    get_team_matches,
    get_player_stats_for_season,
    get_upcoming_matches
)

# AI domain
from backend.shared.models.ai import (
    Video,
    Analysis,
    Event,
    Heatmap,
    Formation,
    get_pending_analyses,
    get_analysis_stats,
    get_match_events_timeline,
    find_analyses_with_model
)


__all__ = [
    # Base
    'Base',
    'BaseModel',
    'SoftDeleteModel',
    'ExtendedModel',
    'UUIDMixin',
    'TimestampMixin',
    'SoftDeleteMixin',
    'MetadataMixin',
    'SerializableMixin',
    'ActiveRecordQuery',
    'get_json_type',
    
    # User domain
    'User',
    'UserProfile',
    'Role',
    'Permission',
    'UserRole',
    'RolePermission',
    'seed_rbac_data',
    
    # Core domain
    'Team',
    'Player',
    'Season',
    'Match',
    'PlayerMatchStats',
    'get_team_matches',
    'get_player_stats_for_season',
    'get_upcoming_matches',
    
    # AI domain
    'Video',
    'Analysis',
    'Event',
    'Heatmap',
    'Formation',
    'get_pending_analyses',
    'get_analysis_stats',
    'get_match_events_timeline',
    'find_analyses_with_model',
]
