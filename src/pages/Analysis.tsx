import { MainLayout } from "@/components/layout/MainLayout";
import { VideoPlayer } from "@/components/analysis/VideoPlayer";
import { FootballPitch } from "@/components/dashboard/FootballPitch";
import { FormationDisplay } from "@/components/dashboard/FormationDisplay";
import { NumericalAdvantage } from "@/components/dashboard/NumericalAdvantage";
import { Heatmap } from "@/components/analysis/Heatmap";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Users, 
  Target, 
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Analysis() {
  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">
              Match vs FC Lyon - 2ème mi-temps
            </h1>
            <p className="text-sm text-muted-foreground">
              Analysé aujourd'hui à 14:32 • Durée: 1:45
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Partager
          </Button>
          <Button variant="glow">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Joueurs détectés"
          value="22"
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Précision formation"
          value="94%"
          icon={<Target className="w-5 h-5" />}
        />
        <StatCard
          title="Zones à risque"
          value="3"
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <StatCard
          title="Surnombres"
          value="8"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player - Takes 2 columns */}
        <div className="lg:col-span-2">
          <VideoPlayer />
        </div>

        {/* Formation Display */}
        <div className="space-y-6">
          <FormationDisplay
            formation="4-3-3"
            teamName="FC Lyon"
            teamColor="away"
          />
          <FormationDisplay
            formation="4-4-2"
            teamName="Mon équipe"
            teamColor="home"
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <FootballPitch 
          dangerZones={[
            { x: 25, y: 75, radius: 8 },
            { x: 75, y: 70, radius: 6 },
          ]}
        />
        <Heatmap team="home" />
        <NumericalAdvantage />
      </div>

      {/* Analysis Summary */}
      <div className="glass-card p-6 mt-6">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
          Résumé de l'analyse
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Points forts détectés
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                Supériorité numérique sur le flanc droit (3v2)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                Bloc défensif compact (4 joueurs alignés)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                Pressing haut efficace dans le tiers offensif
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Points d'amélioration
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                Espace entre les lignes exposé (15m)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                Flanc gauche sous-utilisé
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                Zone vulnérable en contre-attaque
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Recommandations
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Exploiter le surnombre à droite
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Resserrer le bloc milieu-défense
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Renforcer la couverture du flanc gauche
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
