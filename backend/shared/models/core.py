"""
Core domain models for football entities (teams, players, matches).

Design: Strong relational integrity for domain data.
These are the stable, well-defined business entities.
"""
from sqlalchemy import Column, String, Integer, Date, ForeignKey, Index, CheckConstraint, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from backend.shared.models.base import SoftDeleteModel, BaseModel


# ============================================================================
# Teams
# ============================================================================

class Team(SoftDeleteModel):
    """
    Football team entity.
    
    Design: Core team information with JSONB for extended attributes
    that don't need to be queried frequently (colors, stadium, etc.)
    """
    __tablename__ = "teams"
    
    # Basic information
    name = Column(String(255), nullable=False)
    short_name = Column(String(50))
    country = Column(String(100))
    league = Column(String(100))
    
    # Media
    logo_url = Column(String(500))
    
    # Extended attributes (JSONB for flexibility)
    # Example: {"stadium": "Camp Nou", "founded": 1899, "colors": ["blue", "red"]}
    metadata_ = Column("metadata", JSONB, default=dict)
    
    # Relationships
    home_matches = relationship("Match", foreign_keys="Match.home_team_id", back_populates="home_team")
    away_matches = relationship("Match", foreign_keys="Match.away_team_id", back_populates="away_team")
    players = relationship("Player", back_populates="team")
    
    __table_args__ = (
        Index('idx_teams_name', 'name', postgresql_where=(deleted_at == None)),
        Index('idx_teams_league', 'league', postgresql_where=(deleted_at == None)),
        Index('idx_teams_country', 'country'),
    )
    
    def __repr__(self) -> str:
        return f"<Team(id={self.id}, name={self.name})>"


# ============================================================================
# Players
# ============================================================================

class Player(SoftDeleteModel):
    """
    Football player entity.
    
    Design: Core player profile with JSONB for extended stats and attributes.
    """
    __tablename__ = "players"
    
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="SET NULL"), nullable=True)
    
    # Personal information
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date)
    nationality = Column(String(100))
    
    # Player attributes
    jersey_number = Column(Integer)
    position = Column(String(50))  # GK, DEF, MID, FWD
    
    # Physical attributes
    height_cm = Column(Integer)
    weight_kg = Column(Integer)
    
    # Media
    photo_url = Column(String(500))
    
    # Extended attributes (JSONB)
    # Example: {"preferred_foot": "right", "detailed_position": "CAM", "market_value": 50000000}
    metadata_ = Column("metadata", JSONB, default=dict)
    
    # Relationships
    team = relationship("Team", back_populates="players")
    match_stats = relationship("PlayerMatchStats", back_populates="player")
    
    __table_args__ = (
        Index('idx_players_team', 'team_id', postgresql_where=(deleted_at == None)),
        Index('idx_players_name', 'last_name', 'first_name'),
        Index('idx_players_position', 'position'),
        Index('idx_players_nationality', 'nationality'),
    )
    
    def __repr__(self) -> str:
        return f"<Player(id={self.id}, name={self.first_name} {self.last_name})>"
    
    @property
    def full_name(self) -> str:
        """Get player's full name."""
        return f"{self.first_name} {self.last_name}"


# ============================================================================
# Seasons
# ============================================================================

class Season(BaseModel):
    """
    Season/Competition entity.
    
    Design: Organizes matches into seasons and competitions.
    Examples: "Premier League 2024/25", "Champions League 2024/25"
    """
    __tablename__ = "seasons"
    
    name = Column(String(100), nullable=False)  # "2024/2025"
    competition = Column(String(100), nullable=False)  # "Premier League"
    start_date = Column(Date)
    end_date = Column(Date)
    
    # Extended attributes
    metadata_ = Column("metadata", JSONB, default=dict)
    
    # Relationships
    matches = relationship("Match", back_populates="season")
    
    __table_args__ = (
        Index('idx_seasons_competition', 'competition'),
        Index('idx_seasons_dates', 'start_date', 'end_date'),
        CheckConstraint('end_date >= start_date', name='check_season_dates'),
    )
    
    def __repr__(self) -> str:
        return f"<Season(name={self.name}, competition={self.competition})>"


# ============================================================================
# Matches
# ============================================================================

class Match(SoftDeleteModel):
    """
    Football match entity.
    
    Design: Core match information with strong foreign keys to teams.
    Match events and analysis results are stored in separate tables.
    """
    __tablename__ = "matches"
    
    season_id = Column(UUID(as_uuid=True), ForeignKey("seasons.id", ondelete="SET NULL"), nullable=True)
    home_team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="RESTRICT"), nullable=False)
    away_team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="RESTRICT"), nullable=False)
    
    # Match scheduling
    match_date = Column(DateTime, nullable=False)
    venue = Column(String(255))
    competition = Column(String(100))
    matchday = Column(Integer)  # Round number
    
    # Match result
    home_score = Column(Integer)
    away_score = Column(Integer)
    
    # Match status
    status = Column(String(50), default='scheduled', nullable=False)  # scheduled, live, completed, cancelled
    
    # Match officials and conditions
    referee = Column(String(255))
    attendance = Column(Integer)
    weather_conditions = Column(JSONB)  # {"temperature": 20, "condition": "clear", "wind_speed": 10}
    
    # Extended attributes
    metadata_ = Column("metadata", JSONB, default=dict)
    
    # Relationships
    season = relationship("Season", back_populates="matches")
    home_team = relationship("Team", foreign_keys=[home_team_id], back_populates="home_matches")
    away_team = relationship("Team", foreign_keys=[away_team_id], back_populates="away_matches")
    player_stats = relationship("PlayerMatchStats", back_populates="match")
    
    __table_args__ = (
        Index('idx_matches_date', 'match_date', postgresql_where=(deleted_at == None)),
        Index('idx_matches_home_team', 'home_team_id', postgresql_where=(deleted_at == None)),
        Index('idx_matches_away_team', 'away_team_id', postgresql_where=(deleted_at == None)),
        Index('idx_matches_season', 'season_id', postgresql_where=(deleted_at == None)),
        Index('idx_matches_status', 'status'),
        Index('idx_matches_teams', 'home_team_id', 'away_team_id'),
        CheckConstraint('home_team_id != away_team_id', name='check_different_teams'),
    )
    
    def __repr__(self) -> str:
        return f"<Match(id={self.id}, date={self.match_date})>"
    
    @property
    def result(self) -> str:
        """Get match result as string."""
        if self.home_score is None or self.away_score is None:
            return "Not played"
        return f"{self.home_score}-{self.away_score}"
    
    @property
    def winner(self) -> str:
        """Get match winner."""
        if self.home_score is None or self.away_score is None:
            return "Unknown"
        if self.home_score > self.away_score:
            return "home"
        elif self.away_score > self.home_score:
            return "away"
        return "draw"


# ============================================================================
# Player Match Statistics
# ============================================================================

class PlayerMatchStats(BaseModel):
    """
    Player performance statistics for a specific match.
    
    Design: Basic stats as columns, detailed stats in JSONB.
    Allows querying common stats while keeping detailed metrics flexible.
    """
    __tablename__ = "player_match_stats"
    
    match_id = Column(UUID(as_uuid=True), ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    player_id = Column(UUID(as_uuid=True), ForeignKey("players.id", ondelete="CASCADE"), nullable=False)
    team_id = Column(UUID(as_uuid=True), ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    
    # Basic stats (frequently queried)
    minutes_played = Column(Integer)
    goals = Column(Integer, default=0)
    assists = Column(Integer, default=0)
    yellow_cards = Column(Integer, default=0)
    red_cards = Column(Integer, default=0)
    
    # Overall rating
    rating = Column(Float)
    
    # Detailed statistics (JSONB for flexibility)
    # Example: {
    #   "passing": {"total": 45, "accurate": 38, "accuracy": 0.84},
    #   "shooting": {"total": 3, "on_target": 2},
    #   "defensive": {"tackles": 4, "interceptions": 2, "clearances": 1},
    #   "physical": {"distance_km": 10.5, "sprints": 15, "top_speed": 32.4}
    # }
    detailed_stats = Column(JSONB, default=dict)
    
    # Relationships
    match = relationship("Match", back_populates="player_stats")
    player = relationship("Player", back_populates="match_stats")
    team = relationship("Team")
    
    __table_args__ = (
        Index('idx_player_stats_match', 'match_id'),
        Index('idx_player_stats_player', 'player_id'),
        Index('idx_player_stats_team', 'team_id'),
        CheckConstraint('minutes_played >= 0 AND minutes_played <= 120', name='check_minutes_valid'),
        CheckConstraint('goals >= 0', name='check_goals_positive'),
        CheckConstraint('assists >= 0', name='check_assists_positive'),
    )
    
    def __repr__(self) -> str:
        return f"<PlayerMatchStats(match_id={self.match_id}, player_id={self.player_id})>"


# ============================================================================
# Query Helpers
# ============================================================================

def get_team_matches(session, team_id, limit=10):
    """Get recent matches for a team."""
    from sqlalchemy import or_
    
    return session.query(Match).filter(
        or_(Match.home_team_id == team_id, Match.away_team_id == team_id),
        Match.deleted_at.is_(None)
    ).order_by(Match.match_date.desc()).limit(limit).all()


def get_player_stats_for_season(session, player_id, season_id):
    """Get aggregated player statistics for a season."""
    from sqlalchemy import func
    
    return session.query(
        func.sum(PlayerMatchStats.goals).label('total_goals'),
        func.sum(PlayerMatchStats.assists).label('total_assists'),
        func.sum(PlayerMatchStats.minutes_played).label('total_minutes'),
        func.avg(PlayerMatchStats.rating).label('avg_rating'),
        func.count(PlayerMatchStats.id).label('matches_played')
    ).join(Match).filter(
        PlayerMatchStats.player_id == player_id,
        Match.season_id == season_id,
        Match.deleted_at.is_(None)
    ).first()


def get_upcoming_matches(session, days=7, limit=20):
    """Get upcoming matches in the next N days."""
    from datetime import datetime, timedelta
    
    start_date = datetime.utcnow()
    end_date = start_date + timedelta(days=days)
    
    return session.query(Match).filter(
        Match.match_date >= start_date,
        Match.match_date <= end_date,
        Match.status == 'scheduled',
        Match.deleted_at.is_(None)
    ).order_by(Match.match_date).limit(limit).all()
