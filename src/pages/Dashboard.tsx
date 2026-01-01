import { FileVideo, Users, Target, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentAnalysis } from "@/components/dashboard/RecentAnalysis";
import { FormationDisplay } from "@/components/dashboard/FormationDisplay";
import { FootballPitch } from "@/components/dashboard/FootballPitch";
import { NumericalAdvantage } from "@/components/dashboard/NumericalAdvantage";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-1">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Bienvenue, Coach. Voici un aperçu de vos analyses.
          </p>
        </div>
        <Link to="/upload">
          <Button variant="glow" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle analyse
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Analyses */}
        <div className="lg:col-span-2">
          <RecentAnalysis />
        </div>

        {/* Right Column - Formation */}
        <div className="space-y-6">
          <FormationDisplay
            formation="4-3-3"
            teamName="Mon équipe"
            teamColor="home"
          />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FootballPitch />
        <NumericalAdvantage />
      </div>
    </MainLayout>
  );
}
