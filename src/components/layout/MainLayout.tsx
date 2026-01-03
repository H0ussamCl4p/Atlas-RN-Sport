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
        <main className="min-h-screen transition-all duration-300 md:pl-16 lg:pl-64 pt-14 md:pt-0">
          <div className="p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </OnboardingFlow>
  );
}
