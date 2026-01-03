# Atlas Database Architecture

**Production-Ready Database Design for AI-Powered Football Analytics Platform**

---

## 📊 Schema Overview

### Database Strategy: Database-per-Service Pattern

```
┌─────────────────────────────────────────────────────────┐
│                   Atlas Platform                         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Auth Service │  │ Core Service │  │ AI Service   │  │
│  │   (Port 8001)│  │  (Port 8002) │  │ (Port 8003)  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │           │
│         ▼                 ▼                  ▼           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   auth_db    │  │   core_db    │  │    ai_db     │  │
│  │  (minimal)   │  │  (matches,   │  │  (analyses,  │  │
│  │              │  │   teams,     │  │   events)    │  │
│  │              │  │   players)   │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Design Decision:** Separate databases for each domain to ensure:
- Independent scaling
- Clear service boundaries
- Database-level isolation
- Independent deployment cycles

---

## 🗂️ Domain Breakdown

### 1️⃣ Authentication Domain (`auth_db`)

**Purpose:** User authentication and authorization only

**Tables:**
- `users` - Core authentication data
- `user_profiles` - Extended user information
- `roles` - Role definitions (coach, analyst, admin)
- `permissions` - Granular permission system
- `user_roles` - Many-to-many mapping

**Why Separate?**
- Auth must be lightweight and fast
- Can scale independently
- Security isolation
- Reusable across all services

---

### 2️⃣ Core Domain (`core_db`)

**Purpose:** Football-specific domain entities

**Tables:**
- `teams` - Team information
- `players` - Player profiles and stats
- `matches` - Match metadata and scheduling
- `seasons` - Season/competition organization
- `player_match_stats` - Performance data per match

**Why This Design?**
- Strong relational integrity for domain entities
- Normalized data reduces redundancy
- Easy to query and report on
- Supports historical data analysis

---

### 3️⃣ AI Analysis Domain (`ai_db`)

**Purpose:** AI/ML analysis pipeline and results

**Tables:**
- `analyses` - Analysis jobs and results (JSONB-heavy)
- `events` - Match events with hybrid storage
- `videos` - Video metadata and processing status
- `heatmaps` - Generated heatmap data
- `formations` - Detected formations (JSONB)

**Why JSONB?**
- AI model outputs are inherently unstructured
- Schema evolves with new models
- Fast JSON operations in PostgreSQL
- Flexibility without migrations for every model change

---

## 🎯 Relational vs JSONB Strategy

### Use **RELATIONAL** for:
✅ **Stable domain entities** (users, teams, players, matches)
✅ **Data requiring strong integrity** (foreign keys, cascades)
✅ **Frequently queried fields** (indexed columns)
✅ **Normalized business data** (reduce redundancy)
✅ **Reporting and aggregations** (GROUP BY, JOINs)

### Use **JSONB** for:
✅ **AI model inputs** (variable structure per model)
✅ **AI model outputs** (predictions, detections, classifications)
✅ **Model metadata** (hyperparameters, versions, configs)
✅ **Event payloads** (variable event types)
✅ **Rapidly evolving schemas** (avoid migrations)
✅ **Semi-structured data** (tracking data, telemetry)

### Example Decision Tree:
```
Is this data queried frequently with WHERE/JOIN?
├─ YES → Use relational columns + indexes
└─ NO → Is the structure fixed and stable?
    ├─ YES → Use relational if integrity matters
    └─ NO → Use JSONB for flexibility
```

---

## 📐 Complete Schema Design

### Authentication Domain

```sql
-- Core authentication (minimal, fast)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL  -- Soft delete
);
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;

-- Extended user information (non-auth)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    organization VARCHAR(255),
    role_in_org VARCHAR(100),  -- Coach, Analyst, etc.
    avatar_url TEXT,
    preferences JSONB,  -- UI preferences, notifications, etc.
    metadata JSONB,  -- Extensible user data
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Role-based access control
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,  -- admin, coach, analyst, viewer
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,  -- Prevents deletion
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,  -- e.g., "analyses.create", "videos.delete"
    resource VARCHAR(50) NOT NULL,  -- analyses, videos, teams, etc.
    action VARCHAR(50) NOT NULL,  -- create, read, update, delete, execute
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_permissions_resource ON permissions(resource, action);

-- Many-to-many: users <-> roles
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    assigned_by UUID REFERENCES users(id),
    UNIQUE(user_id, role_id)
);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- Many-to-many: roles <-> permissions
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
```

---

### Core Domain (Matches, Teams, Players)

```sql
-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    country VARCHAR(100),
    league VARCHAR(100),
    logo_url TEXT,
    metadata JSONB,  -- Stadium, colors, founded_year, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
CREATE INDEX idx_teams_name ON teams(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_teams_league ON teams(league) WHERE deleted_at IS NULL;

-- Players
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    jersey_number INTEGER,
    position VARCHAR(50),  -- GK, DEF, MID, FWD
    date_of_birth DATE,
    nationality VARCHAR(100),
    height_cm INTEGER,
    weight_kg INTEGER,
    metadata JSONB,  -- Foot preference, detailed position, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
CREATE INDEX idx_players_team ON players(team_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_players_name ON players(last_name, first_name);
CREATE INDEX idx_players_position ON players(position);

-- Seasons
CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,  -- "2024/2025", "World Cup 2026"
    competition VARCHAR(100) NOT NULL,  -- "Premier League", "Champions League"
    start_date DATE,
    end_date DATE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Matches
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES seasons(id) ON DELETE SET NULL,
    home_team_id UUID NOT NULL REFERENCES teams(id),
    away_team_id UUID NOT NULL REFERENCES teams(id),
    match_date TIMESTAMP NOT NULL,
    venue VARCHAR(255),
    competition VARCHAR(100),
    matchday INTEGER,  -- Round number
    
    -- Scores
    home_score INTEGER,
    away_score INTEGER,
    
    -- Match status
    status VARCHAR(50) DEFAULT 'scheduled',  -- scheduled, live, completed, cancelled
    
    -- Metadata
    referee VARCHAR(255),
    attendance INTEGER,
    weather_conditions JSONB,
    metadata JSONB,  -- Additional match info
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CHECK (home_team_id != away_team_id)
);
CREATE INDEX idx_matches_date ON matches(match_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_matches_teams ON matches(home_team_id, away_team_id);
CREATE INDEX idx_matches_season ON matches(season_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_matches_status ON matches(status);

-- Player match statistics
CREATE TABLE player_match_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id),
    
    -- Basic stats
    minutes_played INTEGER,
    goals INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    yellow_cards INTEGER DEFAULT 0,
    red_cards INTEGER DEFAULT 0,
    
    -- Extended stats (JSONB for flexibility)
    detailed_stats JSONB,  -- passes, shots, tackles, interceptions, etc.
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(match_id, player_id)
);
CREATE INDEX idx_player_stats_match ON player_match_stats(match_id);
CREATE INDEX idx_player_stats_player ON player_match_stats(player_id);
```

---

### AI Analysis Domain

```sql
-- Videos
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    uploaded_by UUID NOT NULL,  -- Reference to users.id (cross-service)
    
    -- File information
    filename VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    duration_seconds INTEGER,
    resolution VARCHAR(20),  -- "1920x1080"
    fps INTEGER,
    
    -- Storage
    storage_path TEXT NOT NULL,  -- S3 path or local path
    storage_provider VARCHAR(50) DEFAULT 'local',  -- local, s3, gcs
    
    -- Processing status
    status VARCHAR(50) DEFAULT 'uploaded',  -- uploaded, processing, ready, failed
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    processing_error TEXT,
    
    -- Metadata
    metadata JSONB,  -- Camera angles, quality metrics, etc.
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
CREATE INDEX idx_videos_match ON videos(match_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_uploaded_by ON videos(uploaded_by);

-- Analyses (AI/ML job tracking and results)
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
    video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
    created_by UUID NOT NULL,  -- User who initiated analysis
    
    -- Analysis type and model
    analysis_type VARCHAR(100) NOT NULL,  -- "event_detection", "formation", "heatmap", "player_tracking"
    model_name VARCHAR(100) NOT NULL,  -- "yolov8-player-detector", "formation-classifier-v2"
    model_version VARCHAR(50),
    
    -- Processing status
    status VARCHAR(50) DEFAULT 'pending',  -- pending, queued, processing, completed, failed
    priority INTEGER DEFAULT 5,  -- 1-10, for queue ordering
    
    -- Timing
    queued_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    processing_duration_seconds INTEGER,
    
    -- Model configuration
    model_config JSONB,  -- Hyperparameters, thresholds, settings
    
    -- Input data (for reproducibility)
    input_data JSONB,  -- Frame ranges, ROI, preprocessing params
    
    -- Output data (AI results)
    output_data JSONB,  -- Predictions, detections, classifications
    
    -- Quality metrics
    confidence_score FLOAT,  -- Overall confidence
    quality_metrics JSONB,  -- Precision, recall, F1, etc.
    
    -- Error handling
    error_message TEXT,
    error_traceback TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB,  -- GPU used, inference time, etc.
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
CREATE INDEX idx_analyses_match ON analyses(match_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_analyses_video ON analyses(video_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_analyses_status ON analyses(status);
CREATE INDEX idx_analyses_type ON analyses(analysis_type);
CREATE INDEX idx_analyses_created_by ON analyses(created_by);
CREATE INDEX idx_analyses_priority ON analyses(priority) WHERE status IN ('pending', 'queued');

-- JSONB indexes for querying model outputs
CREATE INDEX idx_analyses_output_data ON analyses USING gin(output_data);
CREATE INDEX idx_analyses_model_config ON analyses USING gin(model_config);

-- Events (match events detected by AI or entered manually)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    analysis_id UUID REFERENCES analyses(id) ON DELETE SET NULL,  -- NULL if manual entry
    
    -- Event classification
    event_type VARCHAR(100) NOT NULL,  -- "pass", "shot", "tackle", "goal", "offside", etc.
    event_subtype VARCHAR(100),  -- "long_pass", "header_shot", etc.
    
    -- Timing
    match_minute INTEGER,
    match_second FLOAT,
    video_timestamp_seconds FLOAT,
    half INTEGER,  -- 1, 2, or extra time
    
    -- Actors
    team_id UUID REFERENCES teams(id),
    player_id UUID REFERENCES players(id),
    secondary_player_id UUID REFERENCES players(id),  -- Assist, tackle target, etc.
    
    -- Location (if available)
    location_x FLOAT,  -- Normalized coordinates (0-1)
    location_y FLOAT,
    location_z FLOAT,  -- Height (for aerial events)
    
    -- Event outcome
    outcome VARCHAR(50),  -- "success", "failure", "neutral"
    
    -- Detailed event data (JSONB for flexibility)
    event_data JSONB,  -- Speed, direction, body part, pressure, etc.
    
    -- Detection metadata
    confidence_score FLOAT,  -- AI confidence
    detection_method VARCHAR(50) DEFAULT 'ai',  -- ai, manual, hybrid
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
CREATE INDEX idx_events_match ON events(match_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_player ON events(player_id);
CREATE INDEX idx_events_team ON events(team_id);
CREATE INDEX idx_events_minute ON events(match_minute);
CREATE INDEX idx_events_analysis ON events(analysis_id);

-- JSONB index for querying event details
CREATE INDEX idx_events_data ON events USING gin(event_data);

-- Heatmaps
CREATE TABLE heatmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE SET NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    
    -- Heatmap type
    heatmap_type VARCHAR(100) NOT NULL,  -- "player_position", "team_pressure", "pass_density"
    
    -- Time range
    start_minute INTEGER,
    end_minute INTEGER,
    half INTEGER,
    
    -- Heatmap data
    grid_resolution VARCHAR(20),  -- "50x50", "100x100"
    heatmap_data JSONB NOT NULL,  -- 2D array of values
    
    -- Statistics
    max_value FLOAT,
    mean_value FLOAT,
    total_points INTEGER,
    
    -- Visualization
    color_scheme VARCHAR(50),
    visualization_url TEXT,  -- Pre-rendered image URL
    
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_heatmaps_analysis ON heatmaps(analysis_id);
CREATE INDEX idx_heatmaps_match ON heatmaps(match_id);
CREATE INDEX idx_heatmaps_player ON heatmaps(player_id);
CREATE INDEX idx_heatmaps_type ON heatmaps(heatmap_type);

-- Formations
CREATE TABLE formations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    
    -- Formation detection
    formation_name VARCHAR(50) NOT NULL,  -- "4-3-3", "4-4-2", "3-5-2"
    confidence_score FLOAT,
    
    -- Time range
    start_minute INTEGER,
    end_minute INTEGER,
    duration_minutes INTEGER,
    half INTEGER,
    
    -- Player positions
    player_positions JSONB NOT NULL,  -- Array of {player_id, position, x, y}
    
    -- Formation characteristics
    formation_width FLOAT,
    formation_depth FLOAT,
    compactness_score FLOAT,
    
    -- Tactical insights (AI-generated)
    tactical_analysis JSONB,  -- Strengths, weaknesses, pressing style, etc.
    
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_formations_analysis ON formations(analysis_id);
CREATE INDEX idx_formations_match ON formations(match_id);
CREATE INDEX idx_formations_team ON formations(team_id);
CREATE INDEX idx_formations_name ON formations(formation_name);

-- JSONB indexes
CREATE INDEX idx_formations_positions ON formations USING gin(player_positions);
CREATE INDEX idx_formations_tactical ON formations USING gin(tactical_analysis);
```

---

## 📋 Example JSONB Structures

### 1. Analysis Input Data
```json
{
  "video_config": {
    "start_frame": 0,
    "end_frame": 54000,
    "frame_rate": 30,
    "resolution": [1920, 1080]
  },
  "roi": {
    "pitch_boundaries": {
      "top_left": [120, 80],
      "top_right": [1800, 80],
      "bottom_left": [120, 1000],
      "bottom_right": [1800, 1000]
    }
  },
  "preprocessing": {
    "enhance_contrast": true,
    "stabilization": true,
    "pitch_registration": true
  }
}
```

### 2. Analysis Output Data (Player Detection)
```json
{
  "detections": [
    {
      "frame": 150,
      "timestamp": 5.0,
      "players": [
        {
          "player_id": "uuid-here",
          "team": "home",
          "jersey_number": 10,
          "bbox": [450, 320, 520, 480],
          "position": [0.35, 0.62],
          "confidence": 0.94,
          "pose_keypoints": [...],
          "action": "running"
        }
      ]
    }
  ],
  "summary": {
    "total_frames_processed": 54000,
    "players_detected": 22,
    "avg_confidence": 0.91,
    "processing_time_seconds": 142.5
  }
}
```

### 3. Event Data (Pass Event)
```json
{
  "pass_type": "long_pass",
  "body_part": "right_foot",
  "distance_meters": 28.5,
  "speed_kmh": 65.2,
  "trajectory": {
    "start": [0.35, 0.62],
    "end": [0.72, 0.48],
    "peak_height": 3.2
  },
  "pressure": {
    "defenders_within_3m": 1,
    "pressure_score": 0.6
  },
  "outcome_details": {
    "received_by": "player-uuid",
    "controlled": true,
    "time_to_control": 0.8
  }
}
```

### 4. Formation Tactical Analysis
```json
{
  "formation": "4-3-3",
  "style": {
    "build_up": "short_passing",
    "defensive_line": "high",
    "pressing_intensity": "high",
    "width": "wide"
  },
  "strengths": [
    "Strong central midfield control",
    "Wide attacking options",
    "High defensive line for offside trap"
  ],
  "weaknesses": [
    "Vulnerable to counter-attacks",
    "Exposed space behind fullbacks"
  ],
  "key_patterns": [
    {
      "pattern": "overload_right_flank",
      "frequency": 23,
      "success_rate": 0.67
    }
  ],
  "vs_opponent": {
    "matchup_rating": 7.5,
    "tactical_advantages": [
      "Numerical superiority in midfield"
    ]
  }
}
```

### 5. Model Configuration
```json
{
  "architecture": "YOLOv8-large",
  "weights": "yolov8l-football-v2.pt",
  "input_size": [640, 640],
  "confidence_threshold": 0.6,
  "iou_threshold": 0.45,
  "max_detections": 25,
  "device": "cuda:0",
  "batch_size": 16,
  "preprocessing": {
    "normalize": true,
    "augmentation": false
  },
  "postprocessing": {
    "nms": true,
    "track_objects": true,
    "tracker": "ByteTrack"
  }
}
```

---

## 🔍 Indexing Strategy

### Purpose of Each Index Type

#### 1. **B-Tree Indexes** (Standard)
- Fast equality and range queries
- Used for: UUIDs, foreign keys, timestamps, status fields
- Example: `CREATE INDEX idx_matches_date ON matches(match_date);`

#### 2. **GIN Indexes** (JSONB)
- Fast containment and existence queries on JSONB
- Used for: Querying nested JSON fields
- Example: `CREATE INDEX idx_analyses_output_data ON analyses USING gin(output_data);`

#### 3. **Partial Indexes**
- Index only rows matching a condition
- Used for: Active records (WHERE deleted_at IS NULL)
- Example: `CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;`

#### 4. **Composite Indexes**
- Multi-column indexes for common query patterns
- Example: `CREATE INDEX idx_matches_teams ON matches(home_team_id, away_team_id);`

### JSONB Query Examples

```sql
-- Find analyses with specific model
SELECT * FROM analyses 
WHERE model_config @> '{"architecture": "YOLOv8-large"}';

-- Find events with high pressure
SELECT * FROM events 
WHERE event_data->'pressure'->>'pressure_score' > '0.7';

-- Find formations with specific player in position
SELECT * FROM formations 
WHERE player_positions @> '[{"player_id": "uuid-here"}]';

-- Count analyses by model architecture
SELECT 
    model_config->>'architecture' as architecture,
    COUNT(*) 
FROM analyses 
GROUP BY model_config->>'architecture';
```

---

## 🚀 Future-Proofing Strategy

### 1. **New AI Models**
✅ No schema changes needed - just add new `analysis_type`
✅ Model config and outputs in JSONB - fully flexible
✅ Version tracking via `model_version` field
✅ Keeps historical analyses with old model versions

### 2. **Reprocessing Analyses**
✅ Keep `input_data` for reproducibility
✅ Soft delete old analyses or mark as `superseded`
✅ Link new analysis to old via metadata: `{"reprocessed_from": "old-uuid"}`

### 3. **Multiple Analysis Versions**
```sql
-- Track analysis lineage
SELECT * FROM analyses 
WHERE match_id = 'match-uuid' 
  AND analysis_type = 'player_tracking'
ORDER BY created_at DESC;

-- Compare model versions
SELECT 
    model_version,
    AVG(confidence_score) as avg_confidence,
    AVG(processing_duration_seconds) as avg_duration
FROM analyses
WHERE analysis_type = 'event_detection'
GROUP BY model_version;
```

### 4. **Large-Scale Data Ingestion**
✅ **Partitioning** (PostgreSQL 12+):
```sql
-- Partition analyses by created_at (monthly)
CREATE TABLE analyses_partitioned (LIKE analyses)
PARTITION BY RANGE (created_at);

CREATE TABLE analyses_2026_01 PARTITION OF analyses_partitioned
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

✅ **Archiving Strategy**:
- Archive analyses older than 6 months to cold storage
- Keep summary statistics in main table
- Use `deleted_at` for soft deletes

✅ **Caching Layer**:
- Redis for frequently accessed analyses
- Cache key: `analysis:{id}:output`
- TTL: Based on status (completed = longer TTL)

---

## 🔄 Cross-Service Data Access

### Pattern 1: User ID References
Services store user UUIDs but don't join across databases:

```python
# In core_service
match = db.query(Match).filter_by(id=match_id).first()
# match.created_by is a UUID

# Fetch user details from auth service via HTTP
user_response = requests.get(f"{AUTH_SERVICE_URL}/api/v1/users/{match.created_by}")
user_data = user_response.json()
```

### Pattern 2: Event-Driven Sync
Services emit events when critical data changes:

```python
# When user is deleted in auth_service
await event_bus.publish("user.deleted", {"user_id": user_id})

# Other services listen and cleanup
@event_bus.subscribe("user.deleted")
async def cleanup_user_data(event):
    # Soft delete or anonymize user's data
    db.query(Analysis).filter_by(created_by=event["user_id"])\
      .update({"created_by": None})
```

### Pattern 3: Materialized Views (Advanced)
Periodically sync critical data to read replicas:

```sql
-- In ai_db, create materialized view of team names
CREATE MATERIALIZED VIEW team_names AS
SELECT id, name, short_name FROM external.teams;

-- Refresh periodically
REFRESH MATERIALIZED VIEW team_names;
```

---

## 📊 Monitoring and Observability

### Key Metrics to Track

```sql
-- Analysis queue depth
SELECT status, COUNT(*) 
FROM analyses 
WHERE deleted_at IS NULL
GROUP BY status;

-- Average processing time by model
SELECT 
    model_name,
    AVG(processing_duration_seconds) as avg_seconds,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY processing_duration_seconds) as p95_seconds
FROM analyses
WHERE status = 'completed'
GROUP BY model_name;

-- Error rate by analysis type
SELECT 
    analysis_type,
    COUNT(*) FILTER (WHERE status = 'failed') * 100.0 / COUNT(*) as error_rate
FROM analyses
GROUP BY analysis_type;

-- Database growth rate
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## ✅ Production Readiness Checklist

### Database Configuration
- [ ] Enable connection pooling (PgBouncer)
- [ ] Configure autovacuum for JSONB-heavy tables
- [ ] Set up read replicas for analytics queries
- [ ] Enable point-in-time recovery (PITR)
- [ ] Configure backup retention policy

### Performance
- [ ] ANALYZE tables after bulk inserts
- [ ] Monitor slow query log
- [ ] Set up query plan caching
- [ ] Configure shared_buffers (25% of RAM)
- [ ] Enable parallel query execution

### Security
- [ ] Row-level security (RLS) for multi-tenant (if needed)
- [ ] Encrypted connections (SSL/TLS)
- [ ] Least privilege database users per service
- [ ] Audit logging for sensitive tables
- [ ] Regular security patches

### Monitoring
- [ ] pg_stat_statements for query analysis
- [ ] Prometheus exporter for PostgreSQL
- [ ] Grafana dashboards for metrics
- [ ] Alert on table bloat and vacuum failures
- [ ] Alert on replication lag (if using replicas)

---

**This architecture will serve you for years. It's designed for scale, flexibility, and AI evolution. 🚀**
