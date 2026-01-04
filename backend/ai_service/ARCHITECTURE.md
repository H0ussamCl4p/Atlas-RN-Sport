# AI Service Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                       │
│                        Port 5173                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Upload     │  │   Analysis   │  │   Results    │          │
│  │   Component  │  │   Status     │  │   Display    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           │ JWT Token          │ Poll Status        │ Get Results
           ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway / CORS                           │
└─────────────────────────────────────────────────────────────────┘
           │                    │                    │
           ▼                    ▼                    ▼
┌──────────────────────┐            ┌─────────────────────────────┐
│   Auth Service       │            │      AI Service             │
│   Port 8001          │            │      Port 8002              │
│                      │            │                             │
│  ┌────────────────┐  │            │  ┌────────────────────┐    │
│  │  JWT Verify    │  │            │  │  Video Upload      │    │
│  │  User Auth     │  │            │  │  Analysis Create   │    │
│  └────────────────┘  │            │  └────────────────────┘    │
└──────────────────────┘            │                             │
           │                        │  ┌────────────────────┐    │
           │                        │  │  Background Tasks  │    │
           │                        │  └────────────────────┘    │
           │                        │           │                 │
           │                        │           ▼                 │
           │                        │  ┌────────────────────┐    │
           │                        │  │ Video Processor    │    │
           │                        │  │ - YOLO Detection   │    │
           │                        │  │ - ByteTrack        │    │
           │                        │  │ - Team Classify    │    │
           │                        │  │ - Homography       │    │
           │                        │  └────────────────────┘    │
           │                        │           │                 │
           │                        │           ▼                 │
           │                        │  ┌────────────────────┐    │
           │                        │  │ Tactical Analysis  │    │
           │                        │  │ - Threat Zones     │    │
           │                        │  │ - Weaknesses       │    │
           │                        │  │ - xG by Zone       │    │
           │                        │  └────────────────────┘    │
           │                        │           │                 │
           │                        │           ▼                 │
           │                        │  ┌────────────────────┐    │
           │                        │  │ GNN Model          │    │
           │                        │  │ - Vulnerability    │    │
           │                        │  │ - Predictions      │    │
           │                        │  └────────────────────┘    │
           │                        └─────────────────────────────┘
           │                                     │
           ▼                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Shared PostgreSQL Database                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  users   │  │  videos  │  │ analyses │  │  matches │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow: Video Upload → Analysis → Results

### 1. Upload Video

```
User → Frontend → AI Service → Database
                      │
                      ├─→ Validate file type
                      ├─→ Extract metadata
                      ├─→ Save to uploads/
                      └─→ Create Video record (status: 'uploaded')
```

### 2. Request Analysis

```
User → Frontend → AI Service → Database
                      │
                      ├─→ Verify video ownership
                      ├─→ Create Analysis record (status: 'pending')
                      └─→ Queue background task
                      └─→ Return immediately with analysis_id
```

### 3. Background Processing (Async)

```
Background Task
    │
    ├─→ Update status to 'processing'
    │
    ├─→ Video Processor Service
    │   │
    │   ├─→ YOLO Detection (players, ball, referee)
    │   ├─→ ByteTrack (persistent IDs)
    │   ├─→ SigLIP Team Classification
    │   └─→ Homography Mapping
    │
    ├─→ Tactical Analysis Service
    │   │
    │   ├─→ Threat Zones (opponent density)
    │   ├─→ Weakness Zones (low coverage)
    │   └─→ xG by Zone (position-based)
    │
    ├─→ GNN Model Service (optional)
    │   │
    │   └─→ Vulnerability Predictions
    │
    └─→ Update Analysis record
        ├─→ status: 'completed'
        └─→ output_data: {results...}
```

### 4. Poll for Results

```
User → Frontend → AI Service → Database
                      │
                      ├─→ Check Analysis status
                      │
                      └─→ If 'completed':
                          └─→ Return output_data (tactical report)
```

## File Structure with Purpose

```
ai_service/
│
├── app/
│   ├── main.py                           # FastAPI app, CORS, routing
│   │
│   ├── core/
│   │   ├── config.py                     # Load .env, validate config
│   │   └── deps.py                       # DB session, JWT auth
│   │
│   ├── api/v1/
│   │   ├── videos.py                     # Upload, list, delete videos
│   │   └── analyses.py                   # Create, get, poll analyses
│   │
│   ├── services/
│   │   ├── video_processor_service.py    # Wrap video_processor.py
│   │   ├── gnn_model_service.py          # Load model, run inference
│   │   └── tactical_analysis_service.py  # Threat zones, xG, etc.
│   │
│   └── schemas/
│       ├── video.py                      # VideoResponse, VideoCreate
│       └── analysis.py                   # AnalysisResponse, etc.
│
├── models/
│   └── best_model.pth                    # Trained GNN weights
│
├── uploads/
│   └── {uuid}.mp4                        # Uploaded videos
│
├── .env                                  # Environment variables
├── requirements.txt                      # Python dependencies
└── run.bat                               # Start script
```

## Data Models

### Video Table

```sql
videos
├── id (UUID, PK)
├── match_id (UUID, FK, nullable)
├── uploaded_by (UUID, FK) ─────────┐
├── filename (String)                │
├── file_size_bytes (BigInt)         │
├── duration_seconds (Int)           │
├── fps (Int)                        │
├── resolution (String)              │
├── storage_path (String)            │
├── storage_provider (String)        │
├── status (Enum) ───────────────────┼── 'uploaded', 'processing', 'ready', 'failed'
├── processing_started_at (DateTime) │
├── processing_completed_at          │
├── metadata (JSONB) ────────────────┘
├── created_at (DateTime)
├── updated_at (DateTime)
└── deleted_at (DateTime, nullable)
```

### Analysis Table

```sql
analyses
├── id (UUID, PK)
├── video_id (UUID, FK) ─────────────┐
├── analysis_type (String) ──────────┼── 'tactical_vulnerability'
├── model_name (String) ─────────────┼── 'tactical_gnn_v1'
├── status (Enum) ───────────────────┼── 'pending', 'processing', 'completed', 'failed'
├── input_data (JSONB) ──────────────┼── {config...}
├── output_data (JSONB) ─────────────┼── {threat_zones, xg_analysis, ...}
├── metadata (JSONB) ────────────────┘
├── processing_started_at (DateTime)
├── processing_completed_at (DateTime)
├── created_at (DateTime)
├── updated_at (DateTime)
└── deleted_at (DateTime, nullable)
```

## Authentication Flow

```
Frontend
   │
   ├─→ Login to auth_service (port 8001)
   │   POST /api/v1/auth/login
   │   {email, password}
   │
   ├─→ Receive JWT token
   │   {access_token: "eyJ..."}
   │
   └─→ Include in all AI service requests
       Authorization: Bearer eyJ...
              │
              ▼
       AI Service (port 8002)
              │
              ├─→ Verify JWT signature
              ├─→ Extract user_id from payload
              ├─→ Check token expiration
              └─→ Proceed with request
```

## Key Design Decisions

### 1. Microservices Architecture

- **Why**: Separation of concerns, independent scaling
- **Auth Service**: User management, authentication
- **AI Service**: Video processing, analysis
- **Shared Database**: Consistency, no data duplication

### 2. Background Processing

- **Why**: Video processing takes minutes, can't block API
- **Implementation**: FastAPI BackgroundTasks
- **Status Tracking**: Database status field ('pending' → 'processing' → 'completed')
- **Polling**: Frontend polls every 5 seconds until completion

### 3. JSONB for AI Data

- **Why**: AI output format evolves, avoid constant migrations
- **Usage**: `input_data`, `output_data`, `metadata` fields
- **Benefits**: Flexibility, no schema locks

### 4. JWT Stateless Auth

- **Why**: No session storage, scalable across services
- **Shared Secret**: Same `JWT_SECRET_KEY` in auth + AI services
- **User Ownership**: Extract `user_id` from token payload

### 5. Service Wrappers

- **Why**: Adapt existing code (video_processor.py) to service interface
- **Implementation**: Thin wrapper classes with error handling
- **Benefits**: Reuse code, maintain clean separation

## Performance Characteristics

### Video Upload

- **Time**: < 1 second (file save + metadata)
- **Size Limit**: 500MB (configurable)
- **Blocking**: No (async file write)

### Video Processing

- **Time**: 5-10 minutes for 90-min match
- **Depends On**: Video length, resolution, GPU availability
- **Blocking**: No (background task)
- **Status**: Track via `Analysis.status`

### GNN Inference

- **Time**: < 1 second per frame
- **GPU**: Recommended for batch processing
- **CPU**: Fallback, slower but works

### Tactical Analysis

- **Time**: 10-30 seconds (depends on frame count)
- **Computation**: NumPy grid calculations
- **Blocking**: No (part of background task)

## Scalability Considerations

### Current MVP (Single Server)

```
Frontend (5173) ──┐
                  ├─→ Nginx ──┐
Auth (8001)    ───┤            ├─→ PostgreSQL
AI (8002)      ───┘            │
                               └─→ File Storage (local)
```

### Production (Horizontal Scaling)

```
Frontend (CDN) ─────→ Load Balancer
                           │
                    ┌──────┴──────┐
                    │             │
                Auth x3        AI x5  (more workers for processing)
                    │             │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │             │
               PostgreSQL    S3 Storage
               (Primary +    (Videos)
                Replicas)
```

### Bottlenecks to Watch

1. **Video Processing**: CPU/GPU intensive → Scale AI workers
2. **Database**: Many concurrent analyses → Read replicas
3. **Storage**: Large video files → Use S3, not local disk
4. **Network**: Upload bandwidth → CDN, compression

## Security Measures

1. **Authentication**: JWT with expiration
2. **Authorization**: User-based resource ownership
3. **File Validation**: Type, size, extension checks
4. **SQL Injection**: SQLAlchemy ORM (parameterized)
5. **CORS**: Whitelist frontend origin only
6. **Rate Limiting**: (TODO: Add rate limiting middleware)
7. **Input Sanitization**: Pydantic schemas

## Error Handling

### API Level

```python
try:
    # Process request
    return success_response
except SpecificError as e:
    raise HTTPException(status_code=400, detail=str(e))
except Exception as e:
    # Log error
    raise HTTPException(status_code=500, detail="Internal error")
```

### Background Task Level

```python
try:
    # Process video
    analysis.status = 'completed'
except Exception as e:
    # Capture full traceback
    analysis.status = 'failed'
    analysis.output_data = {
        'error': str(e),
        'traceback': traceback.format_exc()
    }
```

### Client Level (Frontend)

```typescript
try {
  const result = await createAnalysis(videoId);
  // Poll for results
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 404) {
    // Video not found
  } else {
    // Show error message
  }
}
```

## Monitoring & Debugging

### Logs to Watch

```bash
# Start service with logs
uvicorn app.main:app --reload

# Watch for:
INFO:     Started server process
INFO:     Application startup complete
INFO:     POST /api/v1/videos/upload 201
INFO:     POST /api/v1/analyses/ 201
ERROR:    Error processing video: ...
```

### Database Checks

```sql
-- Check video status
SELECT id, status, created_at FROM videos ORDER BY created_at DESC LIMIT 10;

-- Check analysis status
SELECT id, video_id, status, created_at FROM analyses ORDER BY created_at DESC LIMIT 10;

-- Find failed analyses
SELECT * FROM analyses WHERE status = 'failed';
```

### API Testing

```bash
# Health check
curl http://localhost:8002/health

# Check uploads directory
ls uploads/

# Check models directory
ls models/
```

## Next Steps After MVP

1. **Add rate limiting** (prevent abuse)
2. **Add caching** (Redis for analysis results)
3. **Add WebSockets** (real-time progress updates)
4. **Add email notifications** (analysis complete)
5. **Add batch processing** (multiple videos)
6. **Add S3 storage** (scalable file storage)
7. **Add monitoring** (Prometheus, Grafana)
8. **Add CI/CD** (automated testing, deployment)

---

**This architecture supports your MVP and scales to production! 🚀**
