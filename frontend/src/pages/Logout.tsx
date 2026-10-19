/**
 * Logout Page
 * 
 * Handles user logout and redirects to login page.
 * Automatically triggers logout when component mounts.
 */

import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    // Trigger logout immediately
    logout();
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Déconnexion en cours...</p>
      </div>
    </div>
  );
}
