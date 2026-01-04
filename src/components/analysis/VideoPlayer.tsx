import { useState } from "react";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  x: number;
  y: number;
  team: "home" | "away";
  number?: number;
  role?: "GK" | "DEF" | "MID" | "ATT";
}

interface ThreatZone {
  x: number;
  y: number;
  radius: number;
  threat_score?: number;
  label?: string;
}

interface WeaknessZone {
  x: number;
  y: number;
  radius: number;
  label?: string;
  weakness_score?: number;
  coverage?: number;
}

interface XgZone {
  x: number;
  y: number;
  xg_value?: number;
  shot_count?: number;
}

interface KeyPlayerDependency {
  player_id?: string;
  team?: "home" | "away";
  number?: number;
  involvement_pct?: number;
  label?: string;
  x?: number;
  y?: number;
}

interface CounterAttackRisk {
  zone?: string;
  risk_score?: number;
  note?: string;
  y_min?: number;
  y_max?: number;
}

interface VideoPlayerProps {
  className?: string;
  hasAnalysis?: boolean;
  players?: Player[];
  threatZones?: ThreatZone[];
  weaknessZones?: WeaknessZone[];
  xgZones?: XgZone[];
  vulnerability?: {
    defensive_line?: number;
    midfield?: number;
    attacking_line?: number;
  };
  keyMetrics?: {
    possession_zones?: number;
    high_pressure_areas?: number;
    defensive_vulnerabilities?: number;
  };
  keyPlayer?: KeyPlayerDependency;
  counterRisk?: CounterAttackRisk;
  homeFormation?: string;
  awayFormation?: string;
}

export function VideoPlayer({
  className,
  hasAnalysis = false,
  players = [],
  threatZones = [],
  weaknessZones = [],
  xgZones = [],
  vulnerability,
  keyMetrics,
  keyPlayer,
  counterRisk,
  homeFormation = "4-3-3",
  awayFormation = "4-3-3",
}: VideoPlayerProps) {
  const [showLegend, setShowLegend] = useState(false);
  const getRoleColor = (role?: string, team?: string) => {
    if (team === "home") {
      switch (role) {
        case "GK":
          return "bg-yellow-500/30 border-yellow-400";
        case "DEF":
          return "bg-blue-500/30 border-blue-400";
        case "MID":
          return "bg-cyan-500/30 border-cyan-400";
        case "ATT":
          return "bg-purple-500/30 border-purple-400";
        default:
          return "bg-blue-500/20 border-blue-400";
      }
    } else {
      switch (role) {
        case "GK":
          return "bg-yellow-500/30 border-yellow-400";
        case "DEF":
          return "bg-red-500/30 border-red-400";
        case "MID":
          return "bg-orange-500/30 border-orange-400";
        case "ATT":
          return "bg-pink-500/30 border-pink-400";
        default:
          return "bg-red-500/20 border-red-400";
      }
    }
  };

  return (
    <div className={cn("glass-card overflow-hidden", className)}>
      {/* Tactical Analysis Pitch */}
      <div className="relative aspect-video bg-gradient-to-b from-green-900 via-green-700 to-green-800 overflow-hidden">
        {/* Subtle control grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#0f172a40_1px,transparent_0)] [background-size:24px_24px] opacity-20" />

        {/* Formation badges */}
        {hasAnalysis && (
          <>
            <div className="absolute top-3 left-3 bg-blue-500/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white border border-blue-400/50">
              {homeFormation}
            </div>
            <div className="absolute top-3 right-3 bg-red-500/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white border border-red-400/50">
              {awayFormation}
            </div>
          </>
        )}

        {/* Pitch lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Center line */}
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="100"
            stroke="white"
            strokeWidth="0.3"
          />
          {/* Center circle */}
          <circle
            cx="50"
            cy="50"
            r="15"
            fill="none"
            stroke="white"
            strokeWidth="0.3"
          />
          {/* Penalty areas */}
          <rect
            x="0"
            y="25"
            width="20"
            height="50"
            fill="none"
            stroke="white"
            strokeWidth="0.3"
          />
          <rect
            x="80"
            y="25"
            width="20"
            height="50"
            fill="none"
            stroke="white"
            strokeWidth="0.3"
          />
        </svg>

        {/* Counter-attack risk band */}
        {hasAnalysis && counterRisk && (
          <div
            className="absolute left-0 w-full bg-gradient-to-r from-amber-500/10 via-amber-400/12 to-amber-500/10 border-y border-amber-400/20 backdrop-blur-[2px]"
            style={{
              top: `${counterRisk.y_min ?? 40}%`,
              height: `${
                (counterRisk.y_max ?? 60) - (counterRisk.y_min ?? 40)
              }%`,
            }}
          >
            <div className="absolute right-3 top-2 text-[11px] px-3 py-1 rounded-full bg-amber-900/80 border border-amber-400/40 text-amber-50 shadow-md">
              {counterRisk.note || "Risque de transition"}
              {counterRisk.risk_score
                ? ` • ${(counterRisk.risk_score * 100).toFixed(0)}%`
                : ""}
            </div>
          </div>
        )}

        {/* xG zones (expected goals hotspots) - golden glow */}
        {xgZones.map((zone, idx) => (
          <div
            key={`xg-${idx}`}
            className="absolute group"
            style={{
              top: `${zone.y}%`,
              left: `${zone.x}%`,
              transform: "translate(-50%, -50%)",
              width: "10%",
              height: "10%",
            }}
          >
            <div
              className="w-full h-full rounded-full border border-slate-900/80 shadow-[0_0_25px_rgba(251,191,36,0.45)]"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #0f172a 10%, transparent 11%)," +
                  "radial-gradient(circle at 70% 30%, #0f172a 10%, transparent 11%)," +
                  "radial-gradient(circle at 50% 55%, #0f172a 12%, transparent 13%)," +
                  "radial-gradient(circle at 30% 70%, #0f172a 9%, transparent 10%)," +
                  "radial-gradient(circle at 70% 70%, #0f172a 9%, transparent 10%)," +
                  "#f8fafc",
              }}
            />
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <span className="text-xs font-semibold text-amber-100 bg-amber-900/90 px-2 py-1 rounded whitespace-nowrap">
                xG {zone.xg_value ? zone.xg_value.toFixed(2) : "-"}
                {zone.shot_count ? ` • ${zone.shot_count} tirs` : ""}
              </span>
            </div>
          </div>
        ))}

        {/* Weakness zones (defensive vulnerabilities) - light blue */}
        {weaknessZones.map((zone, idx) => (
          <div
            key={`weakness-${idx}`}
            className="absolute rounded-full border-2 border-blue-400/50 bg-blue-500/10 group cursor-help"
            style={{
              top: `${zone.y}%`,
              left: `${zone.x}%`,
              width: `${zone.radius * 2}%`,
              height: `${zone.radius * 2}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <span className="text-xs font-medium text-blue-200 bg-blue-900/80 px-2 py-1 rounded whitespace-nowrap">
                {zone.label || "Faiblesse"}
                {zone.weakness_score
                  ? ` • ${(zone.weakness_score * 100).toFixed(0)}%`
                  : ""}
                {zone.coverage
                  ? ` • Couverture ${(zone.coverage * 100).toFixed(0)}%`
                  : ""}
              </span>
            </div>
          </div>
        ))}

        {/* Threat zones (attacking opportunities) - animated red */}
        {threatZones.map((zone, idx) => (
          <div
            key={`threat-${idx}`}
            className="absolute rounded-full border-2 border-red-400/70 animate-pulse group"
            style={{
              top: `${zone.y}%`,
              left: `${zone.x}%`,
              width: `${zone.radius * 2}%`,
              height: `${zone.radius * 2}%`,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 100%)`,
            }}
          >
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <span className="text-xs font-medium text-red-200 bg-red-900/80 px-2 py-1 rounded whitespace-nowrap">
                {zone.label || "Menace"}{" "}
                {zone.threat_score
                  ? `(${Math.round(zone.threat_score * 100)}%)`
                  : ""}
              </span>
            </div>
          </div>
        ))}

        {/* Player overlays */}
        {hasAnalysis && players.length > 0 && (
          <>
            {players.map((player) => (
              <div
                key={player.id}
                className={cn(
                  "absolute w-9 h-9 border-2 rounded-sm transition-all flex items-center justify-center font-semibold text-xs shadow-lg hover:shadow-xl hover:scale-125",
                  getRoleColor(player.role, player.team)
                )}
                style={{
                  top: `${player.y}%`,
                  left: `${player.x}%`,
                  transform: "translate(-50%, -50%)",
                }}
                title={`#${player.number} - ${player.role || "Player"}`}
              >
                {player.number && (
                  <span
                    className={cn(
                      "font-bold",
                      player.team === "home" ? "text-blue-100" : "text-red-100"
                    )}
                  >
                    {player.number}
                  </span>
                )}
              </div>
            ))}

            {/* Key player halo */}
            {keyPlayer &&
              (() => {
                const matched = players.find(
                  (p) =>
                    (keyPlayer.player_id && p.id === keyPlayer.player_id) ||
                    (keyPlayer.team &&
                      p.team === keyPlayer.team &&
                      keyPlayer.number &&
                      p.number === keyPlayer.number)
                );
                const cx = matched?.x ?? keyPlayer.x;
                const cy = matched?.y ?? keyPlayer.y;
                if (cx === undefined || cy === undefined) return null;
                return (
                  <div
                    className="absolute rounded-full border-2 border-amber-300/80 shadow-[0_0_25px_rgba(251,191,36,0.55)] pointer-events-none"
                    style={{
                      top: `${cy}%`,
                      left: `${cx}%`,
                      width: "18%",
                      height: "18%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="absolute inset-0 rounded-full border border-amber-200/50 animate-ping" />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] px-2 py-1 rounded-full bg-amber-900/90 border border-amber-400/40 text-amber-50 shadow-lg whitespace-nowrap">
                      {keyPlayer.label || "Joueur clé"}
                      {keyPlayer.number ? ` • #${keyPlayer.number}` : ""}
                      {keyPlayer.involvement_pct
                        ? ` • ${(keyPlayer.involvement_pct * 100).toFixed(0)}%`
                        : ""}
                    </div>
                  </div>
                );
              })()}
          </>
        )}

        {/* Empty state */}
        {(!hasAnalysis || players.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-background/80 backdrop-blur flex items-center justify-center mb-4 mx-auto border border-primary/20">
                <Layers className="w-10 h-10 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Analyse tactique</p>
            </div>
          </div>
        )}

        {/* Vulnerability strips */}
        {hasAnalysis && vulnerability && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 space-y-2 text-[11px]">
            {[
              { label: "Ligne déf.", value: vulnerability.defensive_line },
              { label: "Milieu", value: vulnerability.midfield },
              { label: "Ligne att.", value: vulnerability.attacking_line },
            ]
              .filter((item) => item.value !== undefined)
              .map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/70 border border-white/10 rounded-full px-2 py-1 shadow-lg flex items-center gap-2 min-w-[120px]"
                >
                  <span className="text-white/80 whitespace-nowrap">
                    {item.label}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(5, (item.value || 0) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-white/90 font-semibold">
                    {((item.value || 0) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Key metric chips */}
        {hasAnalysis && keyMetrics && (
          <div className="absolute bottom-3 right-3 flex flex-wrap gap-2 max-w-xs justify-end">
            {keyMetrics.possession_zones !== undefined && (
              <div className="px-3 py-2 rounded-lg bg-emerald-900/70 border border-emerald-400/30 text-emerald-50 text-xs font-semibold shadow-md">
                Possession zones • {keyMetrics.possession_zones}
              </div>
            )}
            {keyMetrics.high_pressure_areas !== undefined && (
              <div className="px-3 py-2 rounded-lg bg-orange-900/70 border border-orange-400/30 text-orange-50 text-xs font-semibold shadow-md">
                Haute pression • {keyMetrics.high_pressure_areas}
              </div>
            )}
            {keyMetrics.defensive_vulnerabilities !== undefined && (
              <div className="px-3 py-2 rounded-lg bg-rose-900/70 border border-rose-400/30 text-rose-50 text-xs font-semibold shadow-md">
                Faiblesses déf. • {keyMetrics.defensive_vulnerabilities}
              </div>
            )}
          </div>
        )}

        {/* Legend toggle */}
        {hasAnalysis && players.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-col gap-2">
            <button
              onClick={() => setShowLegend((v) => !v)}
              className="px-3 py-1.5 rounded-full text-[11px] bg-slate-900/80 border border-white/10 text-white shadow"
            >
              {showLegend ? "Masquer la légende" : "Voir la légende"}
            </button>
            {showLegend && (
              <div className="bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-foreground/10">
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-red-400 rounded-full animate-pulse"></div>
                    <span className="text-red-200">Zones de menace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-blue-400 rounded-full"></div>
                    <span className="text-blue-200">Faiblesses défensives</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-amber-400 rounded-full"></div>
                    <span className="text-amber-200">Zones xG</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
