/**
 * RecentAnalysis - iOS-inspired list of recent video analyses
 */

import { Play, Clock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Analysis {
  id: string;
  title: string;
  date: string;
  duration: string;
  formation: string;
}

const mockAnalyses: Analysis[] = [
  {
    id: "1",
    title: "Match vs FC Lyon - 2ème mi-temps",
    date: "Aujourd'hui",
    duration: "1:45",
    formation: "4-3-3",
  },
  {
    id: "2",
    title: "Entrainement - Phase offensive",
    date: "Hier",
    duration: "2:12",
    formation: "4-4-2",
  },
  {
    id: "3",
    title: "Match vs AS Monaco - Action but",
    date: "Il y a 3 jours",
    duration: "0:45",
    formation: "3-5-2",
  },
  {
    id: "4",
    title: "Séance tactique - Transition défensive",
    date: "Il y a 5 jours",
    duration: "3:20",
    formation: "4-2-3-1",
  },
];

export function RecentAnalysis() {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-foreground">
          Analyses récentes
        </h2>
        <Link
          to="/analyses"
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1 group"
        >
          Voir tout
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* iOS-style List */}
      <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
        {mockAnalyses.map((analysis, index) => (
          <Link
            key={analysis.id}
            to={`/analysis/${analysis.id}`}
            className={`flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors group ${
              index !== mockAnalyses.length - 1 ? "border-b border-border/30" : ""
            }`}
          >
            {/* Play Icon */}
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <Play className="w-4 h-4 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate mb-1">
                {analysis.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {analysis.date}
                </span>
                <span>·</span>
                <span>{analysis.duration}</span>
                <span>·</span>
                <span>{analysis.formation}</span>
              </div>
            </div>

            {/* Chevron */}
            <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
