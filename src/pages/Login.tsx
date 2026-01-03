/**
 * Login Page
 * 
 * Editorial, minimal authentication interface.
 * Continuation of landing page aesthetic.
 * Typography-first, calm, analytical.
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { prefersReducedMotion } from "@/animations/analyticalVariants";

export default function Login() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("demo@atlas.ai");
  const [password, setPassword] = useState("Demo123!");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      console.error("Login error:", err);
      let errorMessage = "Échec de la connexion. Veuillez réessayer.";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <motion.div
          className="mb-12 text-center"
          {...(!prefersReducedMotion && {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 },
          })}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-12"
          {...(!prefersReducedMotion && {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: 0.1 },
          })}
        >
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3 tracking-tight">
            Connexion
          </h1>
          <p className="text-lg text-muted-foreground">
            Accédez à votre plateforme d'analyse tactique
          </p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            className="mb-8"
            {...(!prefersReducedMotion && {
              initial: { opacity: 0, y: -10 },
              animate: { opacity: 1, y: 0 },
            })}
          >
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          {...(!prefersReducedMotion && {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: 0.2 },
          })}
        >
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Adresse email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              className="h-12 text-base border-border/50 focus:border-primary"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              className="h-12 text-base border-border/50 focus:border-primary"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 text-base bg-primary hover:bg-primary/90 rounded-sm group"
          >
            {isSubmitting ? (
              <span>Connexion en cours...</span>
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </motion.form>

        {/* Footer Links */}
        <motion.div
          className="mt-12 pt-8 border-t border-border/50 text-center space-y-4"
          {...(!prefersReducedMotion && {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.8, delay: 0.4 },
          })}
        >
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-foreground font-medium hover:text-primary transition-colors"
            >
              Créer un compte
            </Link>
          </p>
          <p className="text-xs text-muted-foreground/70">
            © 2026 Atlas · L'intelligence tactique du football
          </p>
        </motion.div>
      </div>
    </div>
  );
}
