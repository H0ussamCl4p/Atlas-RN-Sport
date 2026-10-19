/**
 * Register Page
 * 
 * Editorial, minimal registration interface.
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

export default function Register() {
  const { isAuthenticated, isLoading: authLoading, register } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  /**
   * Validate email format
   */
  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError("L'email est requis");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Format d'email invalide");
      return false;
    }
    setEmailError(null);
    return true;
  };

  /**
   * Validate password
   */
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Le mot de passe est requis");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  /**
   * Validate password confirmation
   */
  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError("Veuillez confirmer votre mot de passe");
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas");
      return false;
    }
    setConfirmPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ email, password });
    } catch (err: any) {
      console.error("Registration error:", err);
      let errorMessage = "Échec de l'inscription. Veuillez réessayer.";
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === "string") {
          if (detail.includes("already registered") || detail.includes("already exists")) {
            errorMessage = "Cet email est déjà utilisé. Veuillez vous connecter.";
          } else {
            errorMessage = detail;
          }
        }
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
          >
            <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            Retour à l'accueil
          </Link>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-4">
            Créer un compte
          </h1>
          <p className="text-lg text-muted-foreground">
            Rejoignez la plateforme d'analyse tactique
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Alert variant="destructive" className="mb-6 border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="nom@exemple.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              disabled={isSubmitting}
              className={`h-12 bg-background border-border/50 focus:border-primary transition-colors ${
                emailError ? "border-destructive" : ""
              }`}
              required
            />
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
                if (confirmPasswordError) setConfirmPasswordError(null);
              }}
              disabled={isSubmitting}
              className={`h-12 bg-background border-border/50 focus:border-primary transition-colors ${
                passwordError ? "border-destructive" : ""
              }`}
              required
            />
            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirmer le mot de passe
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) setConfirmPasswordError(null);
              }}
              disabled={isSubmitting}
              className={`h-12 bg-background border-border/50 focus:border-primary transition-colors ${
                confirmPasswordError ? "border-destructive" : ""
              }`}
              required
            />
            {confirmPasswordError && (
              <p className="text-sm text-destructive">{confirmPasswordError}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium group"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary-foreground animate-pulse" />
                Inscription...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Créer mon compte
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </Button>
        </motion.form>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 pt-8 border-t border-border/50 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Se connecter
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
