/**
 * Profile Completion Modal
 * 
 * Second step of onboarding flow - user completes their profile.
 * Displayed as a modal dialog with form fields.
 * Enhanced with staggered field animations for premium feel.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { updateUserProfileApi } from "@/services/api";
import {
  modalVariants,
  fieldVariants,
  headerVariants,
} from "@/animations/onboardingVariants";

interface ProfileCompletionModalProps {
  open: boolean;
  onComplete: () => void;
}

export function ProfileCompletionModal({ open, onComplete }: ProfileCompletionModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");
  const [level, setLevel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Validation
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [organizationError, setOrganizationError] = useState<string | null>(null);
  const [levelError, setLevelError] = useState<string | null>(null);

  const validateFields = (): boolean => {
    let isValid = true;

    if (!firstName.trim()) {
      setFirstNameError("Le prénom est requis");
      isValid = false;
    } else {
      setFirstNameError(null);
    }

    if (!lastName.trim()) {
      setLastNameError("Le nom est requis");
      isValid = false;
    } else {
      setLastNameError(null);
    }

    if (!organization.trim()) {
      setOrganizationError("Le club/organisation est requis");
      isValid = false;
    } else {
      setOrganizationError(null);
    }

    if (!level) {
      setLevelError("Le niveau est requis");
      isValid = false;
    } else {
      setLevelError(null);
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await updateUserProfileApi({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        organization: organization.trim(),
        level,
      });

      onComplete();
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.detail || "Échec de la mise à jour du profil. Veuillez réessayer.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <motion.div
          variants={prefersReducedMotion ? {} : modalVariants}
          initial="hidden"
          animate="visible"
        >
          <DialogHeader>
            <motion.div variants={prefersReducedMotion ? {} : headerVariants}>
              <DialogTitle className="text-2xl">Complétez votre profil</DialogTitle>
            </motion.div>
            <motion.div variants={prefersReducedMotion ? {} : headerVariants}>
              <DialogDescription>
                Quelques informations pour personnaliser votre espace Atlas
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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

              {/* First Name */}
              <motion.div
                className="space-y-2"
                variants={prefersReducedMotion ? {} : fieldVariants}
              >
                <Label htmlFor="firstName">
                  Prénom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="Jean"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (firstNameError) setFirstNameError(null);
                  }}
                  disabled={isSubmitting}
                  className="h-11"
                />
                {firstNameError && (
                  <p className="text-sm text-destructive">{firstNameError}</p>
                )}
              </motion.div>

              {/* Last Name */}
              <motion.div
                className="space-y-2"
                variants={prefersReducedMotion ? {} : fieldVariants}
              >
                <Label htmlFor="lastName">
                  Nom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Dupont"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (lastNameError) setLastNameError(null);
                  }}
                  disabled={isSubmitting}
                  className="h-11"
                />
                {lastNameError && (
                  <p className="text-sm text-destructive">{lastNameError}</p>
                )}
              </motion.div>

              {/* Organization */}
              <motion.div
                className="space-y-2"
                variants={prefersReducedMotion ? {} : fieldVariants}
              >
                <Label htmlFor="organization">
                  Club / Organisation <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="organization"
                  placeholder="FC Exemple"
                  value={organization}
                  onChange={(e) => {
                    setOrganization(e.target.value);
                    if (organizationError) setOrganizationError(null);
                  }}
                  disabled={isSubmitting}
                  className="h-11"
                />
                {organizationError && (
                  <p className="text-sm text-destructive">{organizationError}</p>
                )}
              </motion.div>

              {/* Level */}
              <motion.div
                className="space-y-2"
                variants={prefersReducedMotion ? {} : fieldVariants}
              >
                <Label htmlFor="level">
                  Niveau <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={level}
                  onValueChange={(value) => {
                    setLevel(value);
                    if (levelError) setLevelError(null);
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Sélectionnez votre niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amateur">Amateur</SelectItem>
                    <SelectItem value="semi-pro">Semi-professionnel</SelectItem>
                    <SelectItem value="pro">Professionnel</SelectItem>
                  </SelectContent>
                </Select>
                {levelError && (
                  <p className="text-sm text-destructive">{levelError}</p>
                )}
              </motion.div>
            </div>

            <DialogFooter>
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
                    Enregistrement...
                  </>
                ) : (
                  "Terminer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
