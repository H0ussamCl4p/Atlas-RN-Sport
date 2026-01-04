# AI Service - Football Tactical Analysis

Complete microservice for AI-powered football tactical analysis, integrating video processing, GNN-based vulnerability detection, and tactical insights generation.

## 🚀 Quick Start

**Get your MVP running in 15 minutes:**

```bash
cd Atlas-RN-Sport/backend/ai_service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Edit .env with your configuration
run.bat
```

**👉 See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.**

## 📚 Documentation

### Getting Started

- **[QUICKSTART.md](QUICKSTART.md)** - 15-minute setup guide ⚡
- **[SETUP.md](SETUP.md)** - Complete installation and configuration 📖
- **[MVP_CHECKLIST.md](MVP_CHECKLIST.md)** - Step-by-step completion checklist ✅

### Technical

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and data flow 🏗️
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details 🔧
- **[FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)** - React integration guide ⚛️

## 🎯 What This Service Does

1. **Video Upload & Management**

   - Upload match videos (MP4, AVI, MOV, MKV)
   - Extract metadata (duration, fps, resolution)
   - Store and manage video files

2. **Video Processing** (Background)

   - YOLO player detection
   - ByteTrack tracking (persistent player IDs)
   - SigLIP team classification
   - Pitch keypoint detection & homography

3. **Tactical Analysis**

   - Threat zone detection (high-risk areas)
   - Weakness zone detection (low coverage)
   - Expected goals (xG) by pitch zone
   - Grid-based heatmaps

4. **GNN Predictions** (Optional)
   - Vulnerability detection (defensive/midfield/attacking)
   - Pressure vulnerability analysis
   - Spacing vulnerability analysis
   - Key player dependency
   - Counter-attack risk

## 🏗️ Architecture

```
Frontend (5173) ──→ AI Service (8002) ──┐
                                         ├──→ PostgreSQL
Auth Service (8001) ─────────────────────┘
```

- **Port:** 8002
- **Authentication:** JWT (shared with auth_service)
- **Database:** Shared PostgreSQL
- **Processing:** Background tasks (async)

## 📁 Project Structure

```
ai_service/
├── app/
│   ├── main.py                           # FastAPI application
│   ├── core/
│   │   ├── config.py                     # Settings
│   │   └── deps.py                       # Dependencies (DB, auth)
│   ├── api/v1/
│   │   ├── videos.py                     # Video endpoints
│   │   └── analyses.py                   # Analysis endpoints
│   ├── services/
│   │   ├── video_processor_service.py    # Video processing
│   │   ├── gnn_model_service.py          # GNN predictions
│   │   └── tactical_analysis_service.py  # Tactical analysis
│   └── schemas/
│       ├── video.py                      # Video models
│       └── analysis.py                   # Analysis models
├── models/                               # Trained model weights
├── uploads/                              # Uploaded videos
├── .env.example                          # Environment template
├── requirements.txt                      # Dependencies
└── Documentation files...
```

## 🔑 Key Features

- ✅ **RESTful API** with FastAPI
- ✅ **JWT Authentication** (stateless)
- ✅ **Background Processing** (async video analysis)
- ✅ **Multi-format Support** (MP4, AVI, MOV, MKV)
- ✅ **Real-time Status Tracking** (pending → processing → completed)
- ✅ **Flexible Data Storage** (JSONB for AI results)
- ✅ **Complete Error Handling** with detailed logs
- ✅ **API Documentation** (Swagger UI at /docs)

## 🛠️ Configuration

Create `.env` from template:

```bash
copy .env.example .env
```

Required variables:

```env
# Roboflow API Key (get from https://app.roboflow.com/)
ROBOFLOW_API_KEY=your_key_here

# JWT Secret (must match auth_service)
JWT_SECRET_KEY=your_secret_here

# Database URL
DATABASE_URL=postgresql://user:pass@localhost:5432/atlas_db
```

**See [SETUP.md](SETUP.md#step-5-configure-environment-variables) for all options.**

## 🧪 Testing

### Health Check

```bash
curl http://localhost:8002/health
```

### Upload Video

```bash
curl -X POST http://localhost:8002/api/v1/videos/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@match.mp4"
```

### Create Analysis

```bash
curl -X POST http://localhost:8002/api/v1/analyses/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"video_id": "VIDEO_UUID"}'
```

### API Documentation

- **Swagger UI:** http://localhost:8002/docs
- **ReDoc:** http://localhost:8002/redoc

## 📊 API Endpoints

### Videos

- `POST /api/v1/videos/upload` - Upload video
- `GET /api/v1/videos/{video_id}` - Get video details
- `GET /api/v1/videos/` - List videos (paginated)
- `DELETE /api/v1/videos/{video_id}` - Delete video

### Analyses

- `POST /api/v1/analyses/` - Create analysis
- `GET /api/v1/analyses/{analysis_id}` - Get analysis results
- `GET /api/v1/analyses/` - List analyses (paginated)
- `DELETE /api/v1/analyses/{analysis_id}` - Delete analysis

### System

- `GET /` - Root endpoint
- `GET /health` - Health check

## 🔄 Processing Flow

1. **Upload** → Video saved, metadata extracted
2. **Create Analysis** → Background task queued
3. **Process Video** → YOLO detection + tracking + team classification
4. **Tactical Analysis** → Threat zones, weaknesses, xG calculated
5. **GNN Predictions** → Vulnerability scores generated (optional)
6. **Store Results** → Analysis record updated with results
7. **Poll Status** → Frontend polls until completed

**Typical processing time:** 5-10 minutes for 90-minute match

## 🐛 Troubleshooting

### Import Errors

```bash
pip install supervision>=0.20.0 --no-deps
```

### Database Errors

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Create database: `createdb atlas_db`

### Roboflow Errors

- Get API key from https://app.roboflow.com/
- Verify key in `.env`
- Check quota limits

### JWT Errors

- Ensure `JWT_SECRET_KEY` matches auth_service
- Check token expiration
- Use format: `Bearer <token>`

**See [SETUP.md#troubleshooting](SETUP.md#troubleshooting) for more solutions.**

## 🔗 Integration

### With Auth Service (Port 8001)

- Shared JWT secret for authentication
- Shared PostgreSQL database
- User ownership verification

### With Frontend (Port 5173)

- CORS enabled for React app
- REST API for video upload & analysis
- Polling for status updates

**See [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md) for React code examples.**

## 📈 Performance

- **Upload:** < 1 second
- **Video Processing:** 5-10 minutes (depends on video length)
- **GNN Inference:** < 1 second per frame
- **Tactical Analysis:** 10-30 seconds

## 🚢 Deployment

### Development

```bash
run.bat  # Windows
./run.sh # Linux/Mac
```

### Production

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8002 --workers 4
```

**See [SETUP.md#production-mode](SETUP.md#running-the-service) for production setup.**

## 📦 Dependencies

- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - Database ORM
- **PyTorch** - Deep learning
- **PyTorch Geometric** - GNN framework
- **Transformers** - SigLIP model
- **Supervision** - Video processing
- **Inference** - Roboflow YOLO
- **OpenCV** - Video I/O

**See [requirements.txt](requirements.txt) for full list.**

## 📝 Documentation Index

| Document                                               | Purpose            | Audience      |
| ------------------------------------------------------ | ------------------ | ------------- |
| [QUICKSTART.md](QUICKSTART.md)                         | 15-min setup       | Everyone      |
| [SETUP.md](SETUP.md)                                   | Complete guide     | Developers    |
| [MVP_CHECKLIST.md](MVP_CHECKLIST.md)                   | Step-by-step tasks | Team          |
| [ARCHITECTURE.md](ARCHITECTURE.md)                     | System design      | Tech leads    |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Technical details  | Developers    |
| [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)     | React integration  | Frontend devs |

## 🎯 Success Criteria

Your MVP is complete when:

✅ AI service runs on port 8002  
✅ Can upload video via API  
✅ Analysis processes in background  
✅ Results stored in database  
✅ Frontend displays results

**See [MVP_CHECKLIST.md](MVP_CHECKLIST.md) for complete checklist.**

## 🤝 Contributing

1. Follow existing code structure
2. Add tests for new features
3. Update documentation
4. Run linting before commit

## 📄 License

Part of Atlas-RN-Sport football analytics platform.

## 🆘 Support

### Documentation

- Check the docs above (especially SETUP.md)
- Review API docs at http://localhost:8002/docs
- Check service logs for errors

### Common Commands

```bash
# Start service
run.bat

# Check health
curl http://localhost:8002/health

# View database
psql -U user -d atlas_db

# Check logs
# (view terminal where service is running)
```

---

## 🎉 Ready to Start?

1. **Quick start:** [QUICKSTART.md](QUICKSTART.md)
2. **Full setup:** [SETUP.md](SETUP.md)
3. **Complete MVP:** [MVP_CHECKLIST.md](MVP_CHECKLIST.md)

**Let's build your football analytics platform! 🚀⚽**
