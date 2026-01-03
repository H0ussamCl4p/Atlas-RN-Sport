/**
 * Onboarding Flow Wrapper
 * 
 * Orchestrates the complete onboarding experience.
 * Shows role selection and profile completion in sequence.
 * Blocks access to dashboard until onboarding is complete.
 */

import React from "react";
import { RoleSelectionWidget } from "./RoleSelectionWidget";
import { ProfileCompletionModal } from "./ProfileCompletionModal";
import { useOnboarding } from "@/hooks/useOnboarding";

interface OnboardingFlowProps {
  children: React.ReactNode;
}

export function OnboardingFlow({ children }: OnboardingFlowProps) {
  const { currentStep, isOnboardingRequired, completeRoleStep, completeProfileStep } = useOnboarding();

  // If onboarding is not required, render children normally
  if (!isOnboardingRequired) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Children (dashboard) - rendered but blocked by overlays */}
      {children}

      {/* Step 1: Role Selection */}
      {currentStep === "role" && <RoleSelectionWidget onComplete={completeRoleStep} />}

      {/* Step 2: Profile Completion */}
      {currentStep === "profile" && (
        <ProfileCompletionModal open={true} onComplete={completeProfileStep} />
      )}
    </>
  );
}
