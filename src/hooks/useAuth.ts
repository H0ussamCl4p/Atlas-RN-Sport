/**
 * useAuth Hook
 * 
 * Convenient hook to access authentication context in components.
 * 
 * Usage:
 *   const { user, isAuthenticated, login, logout } = useAuth();
 */

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
