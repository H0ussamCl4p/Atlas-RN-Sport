/**
 * AI Service API Client
 * Handles video uploads and tactical analysis requests
 */

import axios from "axios";
import { getAccessToken } from "./api";

const AI_SERVICE_URL = "http://localhost:8002";

// AI service axios instance
const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 600000, // 10 minutes for large video uploads
});

// Add auth interceptor
aiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================================
// TYPES
// ============================================================================

export interface VideoUploadResponse {
  id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  duration: number;
  uploaded_by: string;
  status: string;
  created_at: string;
}

export interface AnalysisResponse {
  id: string;
  video_id: string;
  analysis_type: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_by: string;
  model_name: string;
  output_data?: TacticalAnalysisResults;
  processing_error?: string;
  created_at: string;
  updated_at: string;
  processing_started_at?: string;
  processing_completed_at?: string;
}

export interface TacticalAnalysisResults {
  threat_zones?: {
    zone_id: string;
    x: number;
    y: number;
    threat_score: number;
    player_count: number;
  }[];
  weakness_zones?: {
    zone_id: string;
    x: number;
    y: number;
    weakness_score: number;
    coverage: number;
  }[];
  xg_by_zone?: {
    zone_id: string;
    x: number;
    y: number;
    xg_value: number;
    shot_count: number;
  }[];
  summary?: {
    total_players_detected: number;
    avg_players_per_frame: number;
    home_team_players: number;
    away_team_players: number;
    formations_detected?: {
      home: string;
      away: string;
    };
    key_metrics?: {
      possession_zones: number;
      high_pressure_areas: number;
      defensive_vulnerabilities: number;
    };
    key_player_dependency?: {
      player_id?: string;
      team?: "home" | "away";
      number?: number;
      involvement_pct?: number;
      label?: string;
      x?: number;
      y?: number;
    };
    counter_attack_risk?: {
      zone?: string;
      risk_score?: number;
      note?: string;
      y_min?: number;
      y_max?: number;
    };
  };
  vulnerability_scores?: {
    defensive_line: number;
    midfield: number;
    attacking_line: number;
    pressure_vulnerability: number;
    spacing_vulnerability: number;
    key_player_dependency: number;
  };
}

export interface VideoListResponse {
  videos: VideoUploadResponse[];
  total: number;
}

export interface AnalysisListResponse {
  analyses: AnalysisResponse[];
  total: number;
}

// ============================================================================
// VIDEO ENDPOINTS
// ============================================================================

/**
 * Upload a video file for analysis with retry logic
 * Handles large files (up to 500MB) with extended timeout
 */
export const uploadVideo = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<VideoUploadResponse> => {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Uploading ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB) - Attempt ${attempt}/${maxRetries}`
      );

      const formData = new FormData();
      formData.append("file", file);

      const response = await aiClient.post<VideoUploadResponse>(
        "/api/v1/videos/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          },
          // Increase timeout based on file size
          timeout: Math.max(600000, (file.size / 1024 / 1024) * 10 * 1000), // ~10 sec per MB
        }
      );

      console.log(`Upload successful: ${response.data.filename}`);
      return response.data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Upload attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        // Wait before retry (exponential backoff)
        const waitTime = 1000 * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${waitTime / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw new Error(
    `Video upload failed after ${maxRetries} attempts: ${lastError?.message}`
  );
};

/**
 * Get video details by ID
 */
export const getVideo = async (videoId: string): Promise<VideoUploadResponse> => {
  const response = await aiClient.get<VideoUploadResponse>(`/api/v1/videos/${videoId}`);
  return response.data;
};

/**
 * List all videos
 */
export const listVideos = async (skip = 0, limit = 20): Promise<VideoListResponse> => {
  const response = await aiClient.get<VideoListResponse>("/api/v1/videos/", {
    params: { skip, limit },
  });
  return response.data;
};

/**
 * Delete a video
 */
export const deleteVideo = async (videoId: string): Promise<void> => {
  await aiClient.delete(`/api/v1/videos/${videoId}`);
};

// ============================================================================
// ANALYSIS ENDPOINTS
// ============================================================================

/**
 * Create a new analysis for a video
 */
export const createAnalysis = async (
  videoId: string,
  analysisType = "tactical_vulnerability"
): Promise<AnalysisResponse> => {
  const response = await aiClient.post<AnalysisResponse>("/api/v1/analyses/", {
    video_id: videoId,
    analysis_type: analysisType,
  });
  return response.data;
};

/**
 * Get analysis results by ID
 */
export const getAnalysis = async (analysisId: string): Promise<AnalysisResponse> => {
  const response = await aiClient.get<AnalysisResponse>(`/api/v1/analyses/${analysisId}`);
  return response.data;
};

/**
 * List all analyses
 */
export const listAnalyses = async (skip = 0, limit = 20): Promise<AnalysisListResponse> => {
  const response = await aiClient.get<AnalysisListResponse>("/api/v1/analyses/", {
    params: { skip, limit },
  });
  return response.data;
};

/**
 * Delete an analysis
 */
export const deleteAnalysis = async (analysisId: string): Promise<void> => {
  await aiClient.delete(`/api/v1/analyses/${analysisId}`);
};

/**
 * Poll for analysis completion
 */
export const pollAnalysisStatus = async (
  analysisId: string,
  onUpdate?: (analysis: AnalysisResponse) => void,
  maxAttempts = 60,
  interval = 5000
): Promise<AnalysisResponse> => {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const analysis = await getAnalysis(analysisId);

        if (onUpdate) {
          onUpdate(analysis);
        }

        if (analysis.status === "completed") {
          resolve(analysis);
        } else if (analysis.status === "failed") {
          reject(new Error(analysis.processing_error || "Analysis failed"));
        } else if (attempts >= maxAttempts) {
          reject(new Error("Analysis timeout - maximum polling attempts reached"));
        } else {
          attempts++;
          setTimeout(poll, interval);
        }
      } catch (error) {
        reject(error);
      }
    };

    poll();
  });
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check if AI service is healthy
 */
export const checkAIServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await aiClient.get("/health");
    return response.data.status === "healthy";
  } catch {
    return false;
  }
};
