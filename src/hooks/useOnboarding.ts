/**
 * Onboarding Hook
 * 
 * Manages the onboarding flow state and progression.
 * Determines which step to show based on user data.
 */

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export type OnboardingStep = "role" | "profile" | "complete";

export function useOnboarding() {
  const { user, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("complete");
  const [isOnboardingRequired, setIsOnboardingRequired] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOnboardingRequired(false);
      setCurrentStep("complete");
      return;
    }

    // Check if onboarding is needed
    const needsRole = !user.roles || user.roles.length === 0;
    const needsProfile = !user.profile_completed;

    if (needsRole) {
      setCurrentStep("role");
      setIsOnboardingRequired(true);
    } else if (needsProfile) {
      setCurrentStep("profile");
      setIsOnboardingRequired(true);
    } else {
      setCurrentStep("complete");
      setIsOnboardingRequired(false);
    }
  }, [user]);

  const completeRoleStep = async () => {
    // Refresh user data to get updated role
    await refreshUser();
    // The useEffect will automatically update the step
  };

  const completeProfileStep = async () => {
    // Refresh user data to get updated profile
    await refreshUser();
    // The useEffect will automatically update the step
  };

  return {
    currentStep,
    isOnboardingRequired,
    completeRoleStep,
    completeProfileStep,
  };
}
