/**
 * Authentication Context Provider
 * 
 * Manages authentication state across the entire application.
 * 
 * Features:
 * - Login/logout functionality
 * - Automatic session restoration on app load
 * - User state management
 * - Token persistence (access in memory, refresh in localStorage)
 */

import React, { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  loginApi,
  registerApi,
  getCurrentUserApi,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  getRefreshToken,
  getAccessToken,
  User,
  LoginRequest,
  RegisterRequest,
} from "@/services/api";
import { useNavigate } from "react-router-dom";

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// ============================================================================
// CONTEXT
// ============================================================================

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user;

  /**
   * Fetch current user from API
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await getCurrentUserApi();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      clearTokens();
    }
  }, []);

  /**
   * Restore session on app load
   * If refresh token exists, try to get user data
   */
  useEffect(() => {
    const restoreSession = async () => {
      const refreshToken = getRefreshToken();
      const accessToken = getAccessToken();

      // If we have tokens, try to restore session
      if (refreshToken || accessToken) {
        try {
          await refreshUser();
        } catch (error) {
          console.error("Session restoration failed:", error);
          clearTokens();
        }
      }

      setIsLoading(false);
    };

    restoreSession();
  }, [refreshUser]);

  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        // Call login API
        const response = await loginApi(credentials);

        // Store tokens
        setAccessToken(response.access_token);
        setRefreshToken(response.refresh_token);

        // Fetch user data
        await refreshUser();

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },
    [refreshUser, navigate]
  );

  /**
   * Register new user
   */
  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        // Call register API
        const response = await registerApi(data);

        // Store tokens
        setAccessToken(response.access_token);
        setRefreshToken(response.refresh_token);

        // Fetch user data
        await refreshUser();

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },
    [refreshUser, navigate]
  );

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    // Clear tokens
    clearTokens();

    // Clear user state
    setUser(null);

    // Redirect to login
    navigate("/login");
  }, [navigate]);

  // ============================================================================
  // PROVIDER VALUE
  // ============================================================================

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
