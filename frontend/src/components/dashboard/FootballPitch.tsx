import { cn } from "@/lib/utils";

interface Player {
  id: string;
  x: number;
  y: number;
  team: "home" | "away";
  number?: number;
}

interface FootballPitchProps {
  players?: Player[];
  heatmapData?: { x: number; y: number; intensity: number }[];
  showHeatmap?: boolean;
  dangerZones?: { x: number; y: number; radius: number; label?: string }[];
  title?: string;
  className?: string;
}

const mockPlayers: Player[] = [
  // Home team (blue)
  { id: "h1", x: 50, y: 92, team: "home", number: 1 },
  { id: "h2", x: 20, y: 75, team: "home", number: 2 },
  { id: "h3", x: 40, y: 78, team: "home", number: 4 },
  { id: "h4", x: 60, y: 78, team: "home", number: 5 },
  { id: "h5", x: 80, y: 75, team: "home", number: 3 },
  { id: "h6", x: 25, y: 55, team: "home", number: 6 },
  { id: "h7", x: 50, y: 50, team: "home", number: 8 },
  { id: "h8", x: 75, y: 55, team: "home", number: 10 },
  { id: "h9", x: 20, y: 30, team: "home", number: 11 },
  { id: "h10", x: 50, y: 25, team: "home", number: 9 },
  { id: "h11", x: 80, y: 30, team: "home", number: 7 },
  // Away team (red)
  { id: "a1", x: 50, y: 8, team: "away", number: 1 },
  { id: "a2", x: 20, y: 25, team: "away", number: 2 },
  { id: "a3", x: 40, y: 22, team: "away", number: 4 },
  { id: "a4", x: 60, y: 22, team: "away", number: 5 },
  { id: "a5", x: 80, y: 25, team: "away", number: 3 },
  { id: "a6", x: 30, y: 45, team: "away", number: 6 },
  { id: "a7", x: 50, y: 40, team: "away", number: 8 },
  { id: "a8", x: 70, y: 45, team: "away", number: 10 },
  { id: "a9", x: 35, y: 65, team: "away", number: 11 },
  { id: "a10", x: 65, y: 65, team: "away", number: 9 },
];

export function FootballPitch({
  players = mockPlayers,
  showHeatmap = false,
  dangerZones = [],
  title = "Vue tactique 2D",
  className,
}: FootballPitchProps) {
  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-foreground">
          {title}
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-team-home" />
            <span className="text-muted-foreground">Domicile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-team-away" />
            <span className="text-muted-foreground">Extérieur</span>
          </div>
        </div>
      </div>

      {/* Football Pitch */}
      <div className="relative aspect-[68/105] w-full rounded-xl overflow-hidden">
        {/* Field Background */}
        <div className="absolute inset-0 field-gradient" />

        {/* Heatmap Overlay */}
        {showHeatmap && (
          <div className="absolute inset-0 heatmap-gradient opacity-40" />
        )}

        {/* Danger Zones */}
        {dangerZones.map((zone, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-danger-zone/30 border-2 border-danger-zone/50 animate-pulse"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.radius * 2}%`,
              height: `${zone.radius * 2}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Field Lines SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 68 105"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Outer boundary */}
          <rect
            x="2"
            y="2"
            width="64"
            height="101"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />

          {/* Center line */}
          <line
            x1="2"
            y1="52.5"
            x2="66"
            y2="52.5"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />

          {/* Center circle */}
          <circle
            cx="34"
            cy="52.5"
            r="9.15"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />

          {/* Center dot */}
          <circle cx="34" cy="52.5" r="0.5" fill="hsl(var(--field-lines))" />

          {/* Top penalty area */}
          <rect
            x="13.84"
            y="2"
            width="40.32"
            height="16.5"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />

          {/* Top goal area */}
          <rect
            x="24.84"
            y="2"
            width="18.32"
            height="5.5"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />

          {/* Top penalty spot */}
          <circle cx="34" cy="13" r="0.5" fill="hsl(var(--field-lines))" />

          {/* Top penalty arc */}
          <path
            d="M 25 18.5 A 9.15 9.15 0 0 0 43 18.5"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />

          {/* Bottom penalty area */}
          <rect
            x="13.84"
            y="86.5"
            width="40.32"
            height="16.5"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />

          {/* Bottom goal area */}
          <rect
            x="24.84"
            y="97.5"
            width="18.32"
            height="5.5"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />

          {/* Bottom penalty spot */}
          <circle cx="34" cy="92" r="0.5" fill="hsl(var(--field-lines))" />

          {/* Bottom penalty arc */}
          <path
            d="M 25 86.5 A 9.15 9.15 0 0 1 43 86.5"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />

          {/* Corner arcs */}
          <path
            d="M 2 3 A 1 1 0 0 0 3 2"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />
          <path
            d="M 65 2 A 1 1 0 0 0 66 3"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />
          <path
            d="M 66 102 A 1 1 0 0 0 65 103"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />
          <path
            d="M 3 103 A 1 1 0 0 0 2 102"
            fill="none"
            stroke="hsl(var(--field-lines))"
            strokeWidth="0.3"
          />
        </svg>

        {/* Players */}
        {players.map((player, index) => (
          <div
            key={player.id}
            className={cn(
              "absolute w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 shadow-lg cursor-pointer hover:scale-125",
              player.team === "home"
                ? "bg-team-home text-white"
                : "bg-team-away text-white"
            )}
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
              animationDelay: `${index * 30}ms`,
            }}
          >
            {player.number}
            <div
              className={cn(
                "absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity",
                player.team === "home" ? "bg-team-home/30" : "bg-team-away/30"
              )}
              style={{ transform: "scale(1.5)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
