import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <OnboardingFlow>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-64 min-h-screen transition-all duration-300">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </OnboardingFlow>
  );
}
