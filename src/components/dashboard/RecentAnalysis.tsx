import { Play, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Analysis {
  id: string;
  title: string;
  date: string;
  duration: string;
  formation: string;
  thumbnail?: string;
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
];

export function RecentAnalysis() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          Analyses récentes
        </h2>
        <Button variant="ghost" size="sm" className="text-primary">
          Voir tout
        </Button>
      </div>

      <div className="space-y-4">
        {mockAnalyses.map((analysis, index) => (
          <div
            key={analysis.id}
            className={cn(
              "group flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-transparent hover:border-primary/30 hover:bg-secondary transition-all duration-300 cursor-pointer",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
              <div className="absolute inset-0 field-gradient opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-1 right-1 text-[10px] font-medium bg-background/80 px-1.5 py-0.5 rounded">
                {analysis.duration}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-foreground truncate mb-1">
                {analysis.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {analysis.date}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {analysis.formation}
                </span>
              </div>
            </div>

            {/* Formation Badge */}
            <div className="shrink-0">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                {analysis.formation}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
