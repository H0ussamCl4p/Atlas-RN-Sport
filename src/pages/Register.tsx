/**
 * Register Page
 * 
 * Professional registration interface with:
 * - Email/password/confirm password form
 * - Client-side validation
 * - Loading states
 * - Error handling
 * - Auto-login after successful registration
 * - Redirect to dashboard if already authenticated
 * 
 * Design matches existing Atlas dark/light theme
 */

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield } from "lucide-react";

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
      navigate("/", { replace: true });
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

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call register from AuthContext - this automatically logs in the user
      await register({
        email,
        password,
      });
      
      // Navigation to dashboard is handled by AuthContext
      // No need for manual redirect or success state
    } catch (err: any) {
      console.error("Registration error:", err);

      // Extract error message
      let errorMessage = "Échec de l'inscription. Veuillez réessayer.";

      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        // Handle specific error cases
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

  // Show loading while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            Atlas
          </h1>
          <p className="text-muted-foreground">
            L'intelligence tactique du football
          </p>
        </div>

        {/* Register Card */}
        <Card className="border-border/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Créer un compte</CardTitle>
            <CardDescription>
              Rejoignez Atlas — l'intelligence tactique du football
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  disabled={isSubmitting}
                  required
                  className="h-11"
                />
                {emailError && (
                  <p className="text-sm text-destructive">{emailError}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 caractères"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                    if (confirmPassword && confirmPasswordError) {
                      validateConfirmPassword(e.target.value, confirmPassword);
                    }
                  }}
                  onBlur={() => validatePassword(password)}
                  disabled={isSubmitting}
                  required
                  className="h-11"
                />
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Saisissez à nouveau votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) {
                      validateConfirmPassword(password, e.target.value);
                    }
                  }}
                  onBlur={() => validateConfirmPassword(password, confirmPassword)}
                  disabled={isSubmitting}
                  required
                  className="h-11"
                />
                {confirmPasswordError && (
                  <p className="text-sm text-destructive">{confirmPasswordError}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              {/* Submit Button */}
              <Button
                type="submit"
                variant="glow"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </Button>

              {/* Link to Login */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Déjà un compte ?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>

              {/* Additional Info */}
              <p className="text-center text-sm text-muted-foreground">
                Hackathon RN Sport 2026 • Atlas Football Analytics
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Atlas. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
}
