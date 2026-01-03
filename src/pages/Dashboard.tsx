/**
 * Dashboard - iOS-inspired layout with clean sections and minimal stats
 */

import { FileVideo, Users, Target, Clock, Plus, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { RecentAnalysis } from "@/components/dashboard/RecentAnalysis";
import { FormationDisplay } from "@/components/dashboard/FormationDisplay";
import { FootballPitch } from "@/components/dashboard/FootballPitch";
import { NumericalAdvantage } from "@/components/dashboard/NumericalAdvantage";
import { Button } from "@/components/ui/button";
import { prefersReducedMotion } from "@/animations/analyticalVariants";

export default function Dashboard() {
  const stats = [
    {
      icon: FileVideo,
      label: "Analyses totales",
      value: "24",
      trend: "+12%",
      isPositive: true,
    },
    {
      icon: Users,
      label: "Joueurs détectés",
      value: "528",
      trend: "+8%",
      isPositive: true,
    },
    {
      icon: Target,
      label: "Formations identifiées",
      value: "18",
      trend: null,
      isPositive: null,
    },
    {
      icon: Clock,
      label: "Temps d'analyse",
      value: "2h 45m",
      trend: "-5%",
      isPositive: false,
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-2">
              Tableau de bord
            </h1>
            <p className="text-base text-muted-foreground">
              Bienvenue, Coach. Voici un aperçu de vos analyses.
            </p>
          </div>
          <Link to="/upload" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium group"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle analyse
              <ChevronRight className="w-4 h-4 opacity-0 transition-all group-hover:opacity-100 group-hover:ml-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats Section - iOS-style list */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8"
        >
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`flex items-center justify-between p-4 ${
                    index !== stats.length - 1 ? "border-b border-border/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {stat.trend && (
                      <span
                        className={`text-xs font-medium ${
                          stat.isPositive ? "text-emerald-500" : "text-red-400"
                        }`}
                      >
                        {stat.trend}
                      </span>
                    )}
                    <span className="text-2xl font-light tracking-tight text-foreground">
                      {stat.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Analyses - 2/3 width */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-2"
          >
            <RecentAnalysis />
          </motion.div>

          {/* Formation Display - 1/3 width */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <FormationDisplay
              formation="4-3-3"
              teamName="Mon équipe"
              teamColor="home"
            />
          </motion.div>
        </div>

        {/* Bottom Row - Pitch & Advantage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <FootballPitch />
          </motion.div>
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <NumericalAdvantage />
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
