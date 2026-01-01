import { cn } from "@/lib/utils";

interface HeatmapProps {
  team?: "home" | "away" | "both";
  className?: string;
}

export function Heatmap({ team = "home", className }: HeatmapProps) {
  // Generate mock heatmap data points
  const generateHeatPoints = (teamType: "home" | "away") => {
    const points = [];
    const count = 30;
    
    for (let i = 0; i < count; i++) {
      const isHome = teamType === "home";
      points.push({
        x: 10 + Math.random() * 80,
        y: isHome ? 40 + Math.random() * 55 : 5 + Math.random() * 55,
        intensity: 0.3 + Math.random() * 0.7,
        team: teamType,
      });
    }
    return points;
  };

  const homePoints = team !== "away" ? generateHeatPoints("home") : [];
  const awayPoints = team !== "home" ? generateHeatPoints("away") : [];
  const allPoints = [...homePoints, ...awayPoints];

  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Heatmap
          </h3>
          <p className="text-xs text-muted-foreground">
            Zones de concentration
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {["home", "away", "both"].map((option) => (
            <button
              key={option}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                team === option
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {option === "home" ? "Domicile" : option === "away" ? "Extérieur" : "Les deux"}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap visualization */}
      <div className="relative aspect-[68/105] w-full rounded-xl overflow-hidden">
        {/* Field Background */}
        <div className="absolute inset-0 field-gradient" />

        {/* Field Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          viewBox="0 0 68 105"
          preserveAspectRatio="xMidYMid meet"
        >
          <rect x="2" y="2" width="64" height="101" fill="none" stroke="hsl(var(--field-lines))" strokeWidth="0.3" />
          <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="hsl(var(--field-lines))" strokeWidth="0.3" />
          <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="hsl(var(--field-lines))" strokeWidth="0.3" />
        </svg>

        {/* Heatmap points with blur effect */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>
            <radialGradient id="homeGradient">
              <stop offset="0%" stopColor="hsl(199 89% 48%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="awayGradient">
              <stop offset="0%" stopColor="hsl(0 84% 60%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(0 84% 60%)" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {allPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={point.intensity * 8}
              fill={`url(#${point.team}Gradient)`}
              filter="url(#blur)"
              opacity={point.intensity * 0.6}
            />
          ))}
        </svg>

        {/* Intensity scale */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-background/80 backdrop-blur rounded-lg px-3 py-2">
          <span className="text-[10px] text-muted-foreground">Faible</span>
          <div className="w-20 h-2 rounded-full bg-gradient-to-r from-primary/20 via-primary/50 to-primary" />
          <span className="text-[10px] text-muted-foreground">Fort</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Zone la plus active</p>
          <p className="font-semibold text-foreground">Milieu droit</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Couverture terrain</p>
          <p className="font-semibold text-primary">67%</p>
        </div>
      </div>
    </div>
  );
}
