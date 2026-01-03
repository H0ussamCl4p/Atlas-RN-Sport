/**
 * Centralized API client with automatic token management and refresh logic.
 * 
 * Features:
 * - Axios instance configured for the FastAPI backend
 * - Automatic Authorization header attachment
 * - 401 response interceptor that attempts token refresh
 * - Logout on refresh failure
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Backend base URL
const API_BASE_URL = "http://localhost:8001";

// Token storage keys
const ACCESS_TOKEN_KEY = "atlas_access_token";
const REFRESH_TOKEN_KEY = "atlas_refresh_token";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

let accessToken: string | null = null;

/**
 * Get access token from memory
 */
export const getAccessToken = (): string | null => {
  return accessToken;
};

/**
 * Set access token in memory
 */
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Set refresh token in localStorage
 */
export const setRefreshToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Clear all tokens (logout)
 */
export const clearTokens = (): void => {
  setAccessToken(null);
  setRefreshToken(null);
};

/**
 * Check if user has valid tokens
 */
export const hasTokens = (): boolean => {
  return !!(accessToken || getRefreshToken());
};

// ============================================================================
// REQUEST INTERCEPTOR - Attach Authorization header
// ============================================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    
    // Attach token to all requests except auth endpoints
    if (token && !config.url?.includes("/auth/login") && !config.url?.includes("/auth/register")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR - Handle 401 with token refresh
// ============================================================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response, // Success - pass through
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry login/register requests
      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/register")) {
        return Promise.reject(error);
      }
      
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        // No refresh token - logout
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      
      try {
        // Attempt token refresh
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken }
        );
        
        const { access_token, refresh_token: newRefreshToken } = response.data;
        
        // Update tokens
        setAccessToken(access_token);
        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }
        
        // Retry all queued requests
        processQueue(null, access_token);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - logout
        processQueue(refreshError as AxiosError, null);
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================================================
// API TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  organization?: string;
  level?: string;
  roles: string[];
  profile_completed: boolean;
  is_active: boolean;
  created_at: string;
}

// ============================================================================
// AUTH API CALLS
// ============================================================================

/**
 * Login user
 * Note: Backend uses OAuth2PasswordRequestForm which expects form data with "username" field
 */
export const loginApi = async (credentials: LoginRequest): Promise<TokenResponse> => {
  // Convert to form data format expected by OAuth2PasswordRequestForm
  const formData = new URLSearchParams();
  formData.append('username', credentials.email); // OAuth2 uses "username" field
  formData.append('password', credentials.password);
  
  const response = await apiClient.post<TokenResponse>(
    "/api/v1/auth/login",
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return response.data;
};

/**
 * Register new user
 */
export const registerApi = async (data: RegisterRequest): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>("/api/v1/auth/register", data);
  return response.data;
};

/**
 * Refresh access token
 */
export const refreshTokenApi = async (refreshToken: string): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>("/api/v1/auth/refresh", {
    refresh_token: refreshToken,
  });
  return response.data;
};

/**
 * Get current user
 */
export const getCurrentUserApi = async (): Promise<User> => {
  const response = await apiClient.get<User>("/api/v1/auth/me");
  return response.data;
};

/**
 * Update user role
 */
export const updateUserRoleApi = async (role: string): Promise<User> => {
  const response = await apiClient.post<User>("/api/v1/users/role", { role });
  return response.data;
};

/**
 * Update user profile
 */
export interface ProfileUpdateRequest {
  first_name: string;
  last_name: string;
  organization: string;
  level: string;
}

export const updateUserProfileApi = async (data: ProfileUpdateRequest): Promise<User> => {
  const response = await apiClient.post<User>("/api/v1/users/profile", data);
  return response.data;
};

/**
 * Health check
 */
export const healthCheckApi = async (): Promise<{ status: string }> => {
  const response = await apiClient.get<{ status: string }>("/api/v1/health");
  return response.data;
};
