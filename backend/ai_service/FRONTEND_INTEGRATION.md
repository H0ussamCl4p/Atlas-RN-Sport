# Frontend Integration Guide

## Overview

This guide shows you how to integrate the AI service with your React frontend (Atlas-RN-Sport).

## Step 1: Create AI Service Client

Create `src/services/ai.ts`:

```typescript
import api from "./api";

// Types
export interface Video {
  id: string;
  filename: string;
  file_size_bytes: number;
  duration_seconds: number | null;
  fps: number | null;
  resolution: string | null;
  status: "uploaded" | "processing" | "ready" | "failed";
  created_at: string;
}

export interface Analysis {
  id: string;
  video_id: string;
  analysis_type: string;
  model_name: string;
  status: "pending" | "processing" | "completed" | "failed";
  output_data: {
    threat_analysis?: any;
    weakness_analysis?: any;
    xg_analysis?: any;
    summary?: any;
  };
  created_at: string;
  processing_completed_at: string | null;
}

// API Functions
export const uploadVideo = async (file: File): Promise<Video> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/videos/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getVideo = async (videoId: string): Promise<Video> => {
  const response = await api.get(`/videos/${videoId}`);
  return response.data;
};

export const listVideos = async (
  skip = 0,
  limit = 10
): Promise<{ videos: Video[]; total: number }> => {
  const response = await api.get("/videos/", {
    params: { skip, limit },
  });
  return response.data;
};

export const deleteVideo = async (videoId: string): Promise<void> => {
  await api.delete(`/videos/${videoId}`);
};

export const createAnalysis = async (videoId: string): Promise<Analysis> => {
  const response = await api.post("/analyses/", {
    video_id: videoId,
    analysis_type: "tactical_vulnerability",
    model_name: "tactical_gnn_v1",
  });

  return response.data;
};

export const getAnalysis = async (analysisId: string): Promise<Analysis> => {
  const response = await api.get(`/analyses/${analysisId}`);
  return response.data;
};

export const listAnalyses = async (
  skip = 0,
  limit = 10,
  videoId?: string
): Promise<{ analyses: Analysis[]; total: number }> => {
  const response = await api.get("/analyses/", {
    params: { skip, limit, video_id: videoId },
  });
  return response.data;
};

export const deleteAnalysis = async (analysisId: string): Promise<void> => {
  await api.delete(`/analyses/${analysisId}`);
};
```

## Step 2: Update API Configuration

Update `src/services/api.ts` to support AI service:

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

## Step 3: Configure Vite Proxy

Update `vite.config.ts` to proxy API requests:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api/v1/auth": {
        target: "http://localhost:8001",
        changeOrigin: true,
      },
      "/api/v1/videos": {
        target: "http://localhost:8002",
        changeOrigin: true,
      },
      "/api/v1/analyses": {
        target: "http://localhost:8002",
        changeOrigin: true,
      },
    },
  },
});
```

## Step 4: Create Video Upload Component

Create `src/components/VideoUpload.tsx`:

```tsx
import React, { useState } from "react";
import { uploadVideo, createAnalysis } from "@/services/ai";
import { Alert, Button, Progress, Card } from "@/components/ui";

export const VideoUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type
      const validTypes = [
        "video/mp4",
        "video/avi",
        "video/quicktime",
        "video/x-matroska",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Invalid file type. Please upload MP4, AVI, MOV, or MKV.");
        return;
      }

      // Validate file size (500MB max)
      if (selectedFile.size > 500 * 1024 * 1024) {
        setError("File too large. Maximum size is 500MB.");
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Upload video
      const video = await uploadVideo(file);
      setVideoId(video.id);

      // Start analysis
      await createAnalysis(video.id);

      // Redirect to analysis page
      window.location.href = `/analysis/${video.id}`;
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Match Video</h2>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Video File
          </label>
          <input
            type="file"
            accept="video/mp4,video/avi,video/quicktime,video/x-matroska"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full"
          />
        </div>

        {file && (
          <div className="text-sm text-gray-600">
            <p>File: {file.name}</p>
            <p>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        )}

        {uploading && <Progress value={uploadProgress} className="w-full" />}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload and Analyze"}
        </Button>
      </div>
    </Card>
  );
};
```

## Step 5: Create Analysis Status Component

Create `src/components/AnalysisStatus.tsx`:

```tsx
import React, { useEffect, useState } from "react";
import { getAnalysis } from "@/services/ai";
import type { Analysis } from "@/services/ai";
import { Card, Progress, Alert, Badge } from "@/components/ui";

interface AnalysisStatusProps {
  videoId: string;
}

export const AnalysisStatus: React.FC<AnalysisStatusProps> = ({ videoId }) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const pollAnalysis = async () => {
      try {
        // Get latest analysis for this video
        const { analyses } = await listAnalyses(0, 1, videoId);

        if (analyses.length > 0) {
          const latest = analyses[0];
          setAnalysis(latest);

          // Stop polling if completed or failed
          if (latest.status === "completed" || latest.status === "failed") {
            clearInterval(interval);
          }
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to fetch analysis");
        setLoading(false);
      }
    };

    // Poll every 5 seconds
    pollAnalysis();
    interval = setInterval(pollAnalysis, 5000);

    return () => clearInterval(interval);
  }, [videoId]);

  if (loading) {
    return <div>Loading analysis...</div>;
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (!analysis) {
    return <Alert variant="info">No analysis found</Alert>;
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "warning",
      processing: "info",
      completed: "success",
      failed: "error",
    };
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Analysis Status</h2>
        {getStatusBadge(analysis.status)}
      </div>

      {(analysis.status === "pending" || analysis.status === "processing") && (
        <div className="space-y-2">
          <Progress value={analysis.status === "processing" ? 50 : 10} />
          <p className="text-sm text-gray-600">
            {analysis.status === "pending"
              ? "Analysis queued..."
              : "Processing video... This may take several minutes."}
          </p>
        </div>
      )}

      {analysis.status === "completed" && analysis.output_data && (
        <div className="space-y-4">
          <Alert variant="success">Analysis completed!</Alert>

          {/* Display results */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">
                  {analysis.output_data.summary?.critical_threats || 0}
                </div>
                <div className="text-sm text-gray-600">Critical Threats</div>
              </div>

              <div className="p-4 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">
                  {analysis.output_data.summary?.weak_zones || 0}
                </div>
                <div className="text-sm text-gray-600">Weak Zones</div>
              </div>

              <div className="p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {analysis.output_data.summary?.high_xg_zones || 0}
                </div>
                <div className="text-sm text-gray-600">High xG Zones</div>
              </div>
            </div>
          </div>

          {/* Display threat zones */}
          {analysis.output_data.threat_analysis && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Critical Threat Zones
              </h3>
              <div className="space-y-2">
                {analysis.output_data.threat_analysis.critical_zones?.map(
                  (zone: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between">
                        <span>
                          Zone {idx + 1}: ({zone.x_meters.toFixed(1)}m,{" "}
                          {zone.y_meters.toFixed(1)}m)
                        </span>
                        <span className="font-semibold">
                          Threat: {zone.threat_score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {analysis.status === "failed" && (
        <Alert variant="error">
          Analysis failed: {analysis.output_data?.error || "Unknown error"}
        </Alert>
      )}
    </Card>
  );
};
```

## Step 6: Create Analysis Page

Create `src/pages/AnalysisPage.tsx`:

```tsx
import React from "react";
import { useParams } from "react-router-dom";
import { AnalysisStatus } from "@/components/AnalysisStatus";

export const AnalysisPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();

  if (!videoId) {
    return <div>Video ID not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Tactical Analysis</h1>
      <AnalysisStatus videoId={videoId} />
    </div>
  );
};
```

## Step 7: Add Routes

Update `src/App.tsx` or `src/routes/index.tsx`:

```tsx
import { Routes, Route } from "react-router-dom";
import { VideoUpload } from "@/components/VideoUpload";
import { AnalysisPage } from "@/pages/AnalysisPage";

export const AppRoutes = () => (
  <Routes>
    {/* Existing routes */}
    <Route path="/upload" element={<VideoUpload />} />
    <Route path="/analysis/:videoId" element={<AnalysisPage />} />
  </Routes>
);
```

## Step 8: Add Navigation

Update your navigation component to include upload link:

```tsx
<nav>
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/upload">Upload Video</Link>
  <Link to="/analyses">My Analyses</Link>
</nav>
```

## Testing the Integration

### 1. Start All Services

```bash
# Terminal 1: Auth Service
cd Atlas-RN-Sport/backend/auth_service
uvicorn app.main:app --port 8001 --reload

# Terminal 2: AI Service
cd Atlas-RN-Sport/backend/ai_service
run.bat

# Terminal 3: Frontend
cd Atlas-RN-Sport
npm run dev
```

### 2. Test Flow

1. Open http://localhost:5173
2. Login with your credentials
3. Navigate to /upload
4. Upload a video file
5. Wait for redirect to /analysis/{videoId}
6. Watch status change: pending → processing → completed
7. View analysis results when complete

## Advanced Features

### Add WebSocket for Real-time Updates

Instead of polling, use WebSockets for instant updates:

```typescript
// In ai_service/app/main.py
from fastapi import WebSocket

@app.websocket("/ws/analysis/{analysis_id}")
async def websocket_endpoint(websocket: WebSocket, analysis_id: str):
    await websocket.accept()

    # Send status updates
    while True:
        analysis = get_analysis_from_db(analysis_id)
        await websocket.send_json({
            "status": analysis.status,
            "data": analysis.output_data
        })

        if analysis.status in ['completed', 'failed']:
            break

        await asyncio.sleep(2)
```

```tsx
// In React component
useEffect(() => {
  const ws = new WebSocket(`ws://localhost:8002/ws/analysis/${analysisId}`);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setAnalysis(data);
  };

  return () => ws.close();
}, [analysisId]);
```

### Add Video Player with Overlay

Show tactical overlays on the video:

```tsx
import React, { useRef, useEffect } from "react";

export const TacticalVideoPlayer: React.FC<{
  videoUrl: string;
  heatmap: number[][];
}> = ({ videoUrl, heatmap }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx && heatmap) {
      // Draw heatmap overlay
      heatmap.forEach((row, i) => {
        row.forEach((value, j) => {
          const opacity = value / Math.max(...heatmap.flat());
          ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
          ctx.fillRect(j * 50, i * 50, 50, 50);
        });
      });
    }
  }, [heatmap]);

  return (
    <div className="relative">
      <video ref={videoRef} src={videoUrl} controls className="w-full" />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
      />
    </div>
  );
};
```

## Production Considerations

### 1. Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_AI_SERVICE_URL=https://ai.yourdomain.com
```

### 2. Build for Production

```bash
npm run build
```

### 3. Deploy

- Frontend: Vercel, Netlify, or Cloudflare Pages
- Backend: AWS EC2, DigitalOcean, or Railway
- Database: Managed PostgreSQL (AWS RDS, Supabase)

## Troubleshooting

### CORS Errors

If you see CORS errors:

1. Check `CORS_ORIGINS` in AI service `.env`
2. Verify frontend URL matches exactly
3. Check browser console for details

### 401 Unauthorized

If API calls fail with 401:

1. Verify JWT token is stored in localStorage
2. Check token hasn't expired
3. Ensure `JWT_SECRET_KEY` matches between services

### Upload Fails

If video upload fails:

1. Check file size (< 500MB)
2. Verify file type (mp4, avi, mov, mkv)
3. Check network tab for detailed error

### Analysis Stuck in Processing

If analysis stays in 'processing':

1. Check AI service logs for errors
2. Verify `video_processor.py` is accessible
3. Check Roboflow API key and quota
4. Look at Analysis.output_data for error details

## Next Steps

1. ✅ Create all service files
2. ✅ Create frontend components
3. 🔄 Test end-to-end flow
4. 🔄 Add error handling
5. 🔄 Add loading states
6. 🔄 Style components
7. 🔄 Deploy to production

---

**Your full-stack football analytics platform is ready! 🚀⚽**
