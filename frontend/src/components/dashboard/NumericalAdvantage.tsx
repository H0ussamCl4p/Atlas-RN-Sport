import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface AdvantageZone {
  zone: string;
  home: number;
  away: number;
  advantage: "home" | "away" | "neutral";
}

const mockAdvantages: AdvantageZone[] = [
  { zone: "Tiers offensif", home: 4, away: 3, advantage: "home" },
  { zone: "Milieu de terrain", home: 3, away: 4, advantage: "away" },
  { zone: "Tiers défensif", home: 4, away: 2, advantage: "home" },
  { zone: "Flanc gauche", home: 2, away: 3, advantage: "away" },
  { zone: "Flanc droit", home: 3, away: 2, advantage: "home" },
];

export function NumericalAdvantage() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          Avantages numériques
        </h3>
        <span className="text-xs text-muted-foreground">
          Par zone
        </span>
      </div>

      <div className="space-y-3">
        {mockAdvantages.map((item, index) => (
          <div
            key={item.zone}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg bg-secondary/50 transition-all duration-300 hover:bg-secondary animate-fade-in"
            )}
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <div className="flex items-center gap-3">
              {item.advantage === "home" ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : item.advantage === "away" ? (
                <AlertTriangle className="w-4 h-4 text-warning" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-muted-foreground" />
              )}
              <span className="text-sm font-medium text-foreground">
                {item.zone}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                    item.advantage === "home"
                      ? "bg-team-home/20 text-team-home"
                      : "bg-team-home/10 text-team-home/70"
                  )}
                >
                  {item.home}
                </span>
                <span className="text-muted-foreground text-xs">vs</span>
                <span
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                    item.advantage === "away"
                      ? "bg-team-away/20 text-team-away"
                      : "bg-team-away/10 text-team-away/70"
                  )}
                >
                  {item.away}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Surnombres détectés</span>
          <span className="font-semibold text-primary">8 situations</span>
        </div>
      </div>
    </div>
  );
}
