import { FileVideo, Users, Target, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentAnalysis } from "@/components/dashboard/RecentAnalysis";
import { FormationDisplay } from "@/components/dashboard/FormationDisplay";
import { FootballPitch } from "@/components/dashboard/FootballPitch";
import { NumericalAdvantage } from "@/components/dashboard/NumericalAdvantage";
import { Button } from "@/components/ui/button";
import { responsiveGap, responsivePadding, gridLayouts } from "@/lib/responsive";

export default function Dashboard() {
  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl text-foreground mb-1">
            Tableau de bord
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Bienvenue, Coach. Voici un aperçu de vos analyses.
          </p>
        </div>
        <Link to="/upload" className="w-full sm:w-auto">
          <Button variant="glow" size="lg" className="w-full sm:w-auto min-h-[44px]">
            <Plus className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Nouvelle analyse</span>
            <span className="sm:hidden">Analyser</span>
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className={`${gridLayouts.stats} ${responsiveGap.md} mb-6 sm:mb-8`}>
        <StatCard
          title="Analyses totales"
          value="24"
          icon={<FileVideo className="w-5 h-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Joueurs détectés"
          value="528"
          icon={<Users className="w-5 h-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Formations identifiées"
          value="18"
          icon={<Target className="w-5 h-5" />}
        />
        <StatCard
          title="Temps d'analyse"
          value="2h 45m"
          icon={<Clock className="w-5 h-5" />}
          trend={{ value: 5, isPositive: false }}
        />
      </div>

      {/* Main Content Grid */}
      <div className={`${gridLayouts.dashboardMain} ${responsiveGap.md}`}>
        {/* Left Column - Recent Analyses */}
        <div className="lg:col-span-2">
          <RecentAnalysis />
        </div>

        {/* Right Column - Formation */}
        <div className="space-y-4 sm:space-y-6">
          <FormationDisplay
            formation="4-3-3"
            teamName="Mon équipe"
            teamColor="home"
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className={`${gridLayouts.dashboardBottom} ${responsiveGap.md} mt-4 sm:mt-6`}>
        <FootballPitch />
        <NumericalAdvantage />
      </div>
    </MainLayout>
  );
}
