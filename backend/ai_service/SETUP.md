# AI Service Setup Guide

## Prerequisites

1. **Python 3.10+** installed
2. **PostgreSQL database** (shared with auth_service)
3. **Roboflow API key** from https://app.roboflow.com/
4. **Trained GNN model** (`best_model.pth`)

## Installation Steps

### 1. Navigate to AI Service Directory

```bash
cd Atlas-RN-Sport/backend/ai_service
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

### 3. Activate Virtual Environment

**Windows:**

```bash
venv\Scripts\activate
```

**Linux/Mac:**

```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note:** If you encounter `pyvips` build errors on Windows:

- The requirements.txt already includes `supervision>=0.20.0 --no-deps` to skip pyvips
- If errors persist, install supervision separately: `pip install supervision>=0.20.0 --no-deps`

### 5. Configure Environment Variables

Copy the example environment file:

```bash
copy .env.example .env
```

Edit `.env` and fill in the values:

```env
# Service Configuration
SERVICE_NAME=ai_service
PORT=8002
DEBUG=True

# Roboflow API Key (get from https://app.roboflow.com/)
ROBOFLOW_API_KEY=your_roboflow_api_key_here

# JWT Authentication (must match auth_service)
JWT_SECRET_KEY=your_shared_jwt_secret_here
JWT_ALGORITHM=HS256

# Database (shared with auth_service)
DATABASE_URL=postgresql://user:password@localhost:5432/atlas_db

# CORS (allow frontend origin)
CORS_ORIGINS=http://localhost:5173

# Upload settings
UPLOAD_FOLDER=./uploads
MODEL_FOLDER=./models
MAX_UPLOAD_SIZE=500000000
```

### 6. Copy Trained Model

Copy your trained GNN model to the models directory:

```bash
copy path\to\best_model.pth models\best_model.pth
```

**Note:** If you don't have a trained model yet, the service will run with an untrained model (predictions won't be accurate).

### 7. Initialize Database

The database tables should already exist from the shared models. If not, run:

```bash
cd ../shared
python init_db.py
cd ../ai_service
```

### 8. Verify video_processor.py Location

Make sure `video_processor.py` exists at:

```
football_tactical_analysis/video_processor.py
```

The service automatically adds this path to Python's import path.

## Running the Service

### Development Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

Or use the run script:

**Windows:**

```bash
run.bat
```

**Linux/Mac:**

```bash
./run.sh
```

### Production Mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8002 --workers 4
```

## Testing the Service

### 1. Check Health

```bash
curl http://localhost:8002/health
```

Expected response:

```json
{
  "status": "healthy",
  "service": "ai_service"
}
```

### 2. Test Video Upload

First, get a JWT token from the auth service (port 8001):

```bash
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

Then upload a video:

```bash
curl -X POST http://localhost:8002/api/v1/videos/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@path/to/video.mp4"
```

### 3. Test Analysis Creation

```bash
curl -X POST http://localhost:8002/api/v1/analyses/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "video_id": "VIDEO_UUID_HERE",
    "analysis_type": "tactical_vulnerability",
    "model_name": "tactical_gnn_v1"
  }'
```

### 4. Check Analysis Status

```bash
curl http://localhost:8002/api/v1/analyses/ANALYSIS_UUID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## API Documentation

Once the service is running, access the interactive API docs:

- **Swagger UI:** http://localhost:8002/docs
- **ReDoc:** http://localhost:8002/redoc

## Architecture Overview

```
ai_service/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── core/
│   │   ├── config.py          # Configuration
│   │   └── deps.py            # Dependencies (DB, auth)
│   ├── api/
│   │   └── v1/
│   │       ├── videos.py      # Video upload endpoints
│   │       └── analyses.py    # Analysis endpoints
│   ├── services/
│   │   ├── video_processor_service.py     # Video processing
│   │   ├── gnn_model_service.py           # GNN predictions
│   │   └── tactical_analysis_service.py   # Tactical analysis
│   └── schemas/
│       ├── video.py           # Video schemas
│       └── analysis.py        # Analysis schemas
├── models/                    # Trained model weights
├── uploads/                   # Uploaded videos
└── requirements.txt
```

## Troubleshooting

### Import Errors

If you see "ModuleNotFoundError: No module named 'video_processor'":

- Verify `video_processor.py` exists in `football_tactical_analysis/`
- Check the path in `video_processor_service.py`

### Database Connection Errors

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists: `createdb atlas_db`
- Run migrations if needed

### Roboflow API Errors

- Verify `ROBOFLOW_API_KEY` is set correctly
- Test the key at https://app.roboflow.com/
- Check quota limits on your account

### JWT Authentication Errors

- Ensure `JWT_SECRET_KEY` matches the auth_service
- Verify token is not expired
- Check token format: `Bearer <token>`

### Video Processing Errors

- Check video format (mp4, avi, mov, mkv)
- Verify file size is under `MAX_UPLOAD_SIZE`
- Check GPU availability for faster processing
- Review logs for detailed error messages

## Integration with Frontend

To integrate with the React frontend (Atlas-RN-Sport):

1. **Create AI service client** in `src/services/ai.ts`:

```typescript
import api from "./api";

export const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/ai/videos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const createAnalysis = async (videoId: string) => {
  const response = await api.post("/ai/analyses/", {
    video_id: videoId,
    analysis_type: "tactical_vulnerability",
    model_name: "tactical_gnn_v1",
  });

  return response.data;
};

export const getAnalysis = async (analysisId: string) => {
  const response = await api.get(`/ai/analyses/${analysisId}`);
  return response.data;
};
```

2. **Update API proxy** in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      "/api/v1/auth": "http://localhost:8001",
      "/api/v1/videos": "http://localhost:8002",
      "/api/v1/analyses": "http://localhost:8002",
    },
  },
});
```

3. **Use in components**:

```tsx
import { uploadVideo, createAnalysis, getAnalysis } from "@/services/ai";

const handleUpload = async (file: File) => {
  // Upload video
  const video = await uploadVideo(file);

  // Start analysis
  const analysis = await createAnalysis(video.id);

  // Poll for results
  const pollInterval = setInterval(async () => {
    const result = await getAnalysis(analysis.id);
    if (result.status === "completed") {
      clearInterval(pollInterval);
      // Display results
      console.log(result.output_data);
    }
  }, 5000);
};
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment variables
3. ✅ Copy trained model
4. ✅ Start the service
5. ✅ Test endpoints
6. 🔄 Integrate with frontend
7. 🔄 Deploy to production

## Support

For issues or questions:

- Check the API documentation at `/docs`
- Review error logs in the terminal
- Verify all environment variables are set correctly
