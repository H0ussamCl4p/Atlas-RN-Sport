import { cn } from "@/lib/utils";

interface FormationDisplayProps {
  formation: string;
  teamName?: string;
  teamColor?: "home" | "away";
  className?: string;
}

// Formation positions mapping (normalized 0-100 coordinates)
const formationPositions: Record<string, { x: number; y: number }[]> = {
  "4-3-3": [
    { x: 50, y: 90 }, // GK
    { x: 15, y: 70 }, { x: 35, y: 70 }, { x: 65, y: 70 }, { x: 85, y: 70 }, // DEF
    { x: 30, y: 45 }, { x: 50, y: 45 }, { x: 70, y: 45 }, // MID
    { x: 20, y: 20 }, { x: 50, y: 20 }, { x: 80, y: 20 }, // ATT
  ],
  "4-4-2": [
    { x: 50, y: 90 },
    { x: 15, y: 70 }, { x: 35, y: 70 }, { x: 65, y: 70 }, { x: 85, y: 70 },
    { x: 15, y: 45 }, { x: 38, y: 45 }, { x: 62, y: 45 }, { x: 85, y: 45 },
    { x: 35, y: 20 }, { x: 65, y: 20 },
  ],
  "3-5-2": [
    { x: 50, y: 90 },
    { x: 25, y: 70 }, { x: 50, y: 70 }, { x: 75, y: 70 },
    { x: 10, y: 45 }, { x: 30, y: 45 }, { x: 50, y: 45 }, { x: 70, y: 45 }, { x: 90, y: 45 },
    { x: 35, y: 20 }, { x: 65, y: 20 },
  ],
};

export function FormationDisplay({
  formation,
  teamName = "Équipe",
  teamColor = "home",
  className,
}: FormationDisplayProps) {
  const positions = formationPositions[formation] || formationPositions["4-3-3"];

  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Formation détectée
          </p>
          <h3 className="font-heading font-bold text-2xl text-foreground">
            {formation}
          </h3>
        </div>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            teamColor === "home"
              ? "bg-team-home/20 text-team-home"
              : "bg-team-away/20 text-team-away"
          )}
        >
          {teamName}
        </span>
      </div>

      {/* Mini Field */}
      <div className="relative aspect-[3/4] w-full max-w-[200px] mx-auto rounded-xl overflow-hidden">
        {/* Field Background */}
        <div className="absolute inset-0 field-gradient" />
        
        {/* Field Lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 133"
          preserveAspectRatio="none"
        >
          {/* Border */}
          <rect
            x="5"
            y="5"
            width="90"
            height="123"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.5"
            opacity="0.5"
          />
          {/* Center Line */}
          <line
            x1="5"
            y1="66.5"
            x2="95"
            y2="66.5"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.5"
            opacity="0.5"
          />
          {/* Center Circle */}
          <circle
            cx="50"
            cy="66.5"
            r="12"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.5"
            opacity="0.5"
          />
          {/* Penalty Areas */}
          <rect
            x="25"
            y="5"
            width="50"
            height="20"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.5"
            opacity="0.5"
          />
          <rect
            x="25"
            y="108"
            width="50"
            height="20"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.5"
            opacity="0.5"
          />
        </svg>

        {/* Player Dots */}
        {positions.map((pos, index) => (
          <div
            key={index}
            className={cn(
              "absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
              teamColor === "home" ? "bg-team-home" : "bg-team-away",
              "shadow-lg"
            )}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div
              className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-50",
                teamColor === "home" ? "bg-team-home" : "bg-team-away"
              )}
              style={{ animationDuration: "2s", animationDelay: `${index * 100}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
