/**
 * Role Selection Widget
 * 
 * First step of onboarding flow - user selects their primary role.
 * Displayed as a centered card widget with icon-based role options.
 * Enhanced with subtle micro-animations for premium feel.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Clipboard, LineChart, Check } from "lucide-react";
import { updateUserRoleApi } from "@/services/api";
import {
  overlayVariants,
  roleCardContainerVariants,
  roleCardVariants,
  roleCardHoverVariants,
  checkmarkVariants,
  headerVariants,
  backdropVariants,
} from "@/animations/onboardingVariants";

interface RoleOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const ROLES: RoleOption[] = [
  {
    id: "coach",
    label: "Coach",
    description: "Entraîneur d'équipe",
    icon: <Clipboard className="w-8 h-8" />,
  },
  {
    id: "analyst",
    label: "Analyste",
    description: "Analyste tactique et vidéo",
    icon: <LineChart className="w-8 h-8" />,
  },
];

interface RoleSelectionWidgetProps {
  onComplete: () => void;
}

export function RoleSelectionWidget({ onComplete }: RoleSelectionWidgetProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleSubmit = async () => {
    if (!selectedRole) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await updateUserRoleApi(selectedRole);
      onComplete();
    } catch (err: any) {
      console.error("Role update error:", err);
      setError(err.response?.data?.detail || "Échec de la mise à jour du rôle. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={prefersReducedMotion ? {} : backdropVariants}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          variants={prefersReducedMotion ? {} : backdropVariants}
        />

        {/* Card */}
        <motion.div
          variants={prefersReducedMotion ? {} : overlayVariants}
          className="relative z-10 w-full max-w-2xl mx-4"
        >
          <Card className="border-border/50 shadow-2xl">
            <CardHeader className="text-center">
              <motion.div variants={prefersReducedMotion ? {} : headerVariants}>
                <CardTitle className="text-3xl">Quel est votre rôle ?</CardTitle>
              </motion.div>
              <motion.div variants={prefersReducedMotion ? {} : headerVariants}>
                <CardDescription className="text-base">
                  Cela nous aide à personnaliser votre expérience
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {/* Role Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={prefersReducedMotion ? {} : roleCardContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {ROLES.map((role) => (
                  <motion.button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    disabled={isSubmitting}
                    variants={prefersReducedMotion ? {} : roleCardVariants}
                    whileHover={prefersReducedMotion ? {} : roleCardHoverVariants.hover}
                    whileTap={prefersReducedMotion ? {} : roleCardHoverVariants.tap}
                    animate={selectedRole === role.id ? "selected" : "rest"}
                    className={`
                      relative flex flex-col items-center gap-3 p-6 rounded-lg border-2 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        selectedRole === role.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background"
                      }
                    `}
                  >
                    {/* Selection Checkmark */}
                    {selectedRole === role.id && (
                      <motion.div
                        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                        variants={prefersReducedMotion ? {} : checkmarkVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}

                    {/* Icon */}
                    <motion.div
                      className={`
                        transition-colors
                        ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}
                      `}
                      animate={selectedRole === role.id ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {role.icon}
                    </motion.div>

                    {/* Text */}
                    <div className="text-center">
                      <p className="font-semibold text-lg">{role.label}</p>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </CardContent>

            <CardFooter>
              <Button
                variant="glow"
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={!selectedRole || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Continuer"
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
