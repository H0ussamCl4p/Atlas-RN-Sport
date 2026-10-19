import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { VideoPlayer } from "@/components/analysis/VideoPlayer";
import { FormationDisplay } from "@/components/dashboard/FormationDisplay";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  AlertTriangle,
  ArrowLeft,
  Download,
  Loader2,
  Share2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

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
  radius?: number;
  threat_score: number;
  label?: string;
}

interface WeaknessZone {
  x: number;
  y: number;
  radius?: number;
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

interface SummaryMetrics {
  possession_zones?: number;
  high_pressure_areas?: number;
  defensive_vulnerabilities?: number;
}

interface SummaryBlock {
  key_metrics?: SummaryMetrics;
  formations_detected?: {
    home?: string;
    away?: string;
  };
  total_players_detected?: number;
}

interface Vulnerability {
  defensive_line?: number;
  midfield?: number;
  attacking_line?: number;
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

interface AnalysisResults {
  summary?: SummaryBlock;
  players?: Player[];
  threat_zones?: ThreatZone[];
  weakness_zones?: WeaknessZone[];
  xg?: { zones?: XgZone[] };
  xg_zones?: XgZone[];
  vulnerability?: Vulnerability;
  formations_detected?: {
    home?: string;
    away?: string;
  };
  key_player_dependency?: KeyPlayerDependency;
  counter_attack_risk?: CounterAttackRisk;
}

interface AnalysisMeta {
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

export default function Analysis() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<AnalysisMeta>({
    status: "processing",
  });
  const [results, setResults] = useState<AnalysisResults>({});
  const [planOpen, setPlanOpen] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setAnalysis((prev) => ({
        ...prev,
        status: "processing",
        error: undefined,
      }));
      try {
        const res = await fetch(`/api/analysis/${id ?? "latest"}`);
        const contentType = res.headers.get("content-type") || "";

        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Statut ${res.status}${text ? ` • ${text.slice(0, 120)}` : ""}`
          );
        }

        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(
            `Réponse non JSON (${contentType || "inconnue"})${
              text ? ` • ${text.slice(0, 120)}` : ""
            }`
          );
        }

        const data = await res.json();
        setAnalysis(data.analysis || { status: "completed" });
        setResults(data.results || data || {});
      } catch (err) {
        setAnalysis({ status: "failed", error: (err as Error).message });
      }
    };

    fetchAnalysis();
  }, [id]);

  const threatZones = results.threat_zones || [];
  const weaknessZones = results.weakness_zones || [];
  const xgZones = results.xg_zones || results.xg?.zones || [];
  const summary = results.summary;
  const vulnerability = results.vulnerability;
  const keyPlayerDep = results.key_player_dependency;
  const counterRisk = results.counter_attack_risk;

  const topThreat = threatZones[0];
  const topWeakness = weaknessZones[0];
  const topXg = xgZones[0];

  const headerTitle = useMemo(() => {
    if (!summary?.formations_detected) return "Analyse tactique";
    const home = summary.formations_detected.home || "Home";
    const away = summary.formations_detected.away || "Away";
    return `${home} vs ${away}`;
  }, [summary?.formations_detected]);

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
              {headerTitle}
            </h1>
            <p className="text-sm text-muted-foreground">
              {id ? `Analyse ${id}` : "Dernière analyse"}
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

      {analysis.status === "failed" && (
        <div className="glass-card p-4 mb-4 border-destructive/50 text-destructive">
          Erreur de chargement : {analysis.error || "inconnue"}
        </div>
      )}

      {analysis.status !== "completed" && analysis.status !== "failed" && (
        <div className="glass-card p-6 mb-6 border-warning/50">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-warning" />
            <div>
              <p className="font-medium">Analyse en cours...</p>
              <p className="text-sm text-muted-foreground">
                {analysis.status === "processing"
                  ? "Traitement vidéo en cours"
                  : "En attente de traitement"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Joueurs détectés"
          value={summary?.total_players_detected?.toString() || "N/A"}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Zones de menace"
          value={threatZones.length.toString()}
          icon={<Target className="w-5 h-5" />}
        />
        <StatCard
          title="Zones à risque"
          value={weaknessZones.length.toString()}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
        <StatCard
          title="Zones xG"
          value={xgZones.length.toString()}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer
            hasAnalysis={analysis.status === "completed"}
            players={results.players || []}
            threatZones={threatZones.map((zone) => ({
              x: zone.x,
              y: zone.y,
              radius: zone.radius || 8,
              threat_score: zone.threat_score,
              label: zone.label,
            }))}
            weaknessZones={weaknessZones.map((zone) => ({
              x: zone.x,
              y: zone.y,
              radius: zone.radius || 8,
              label: zone.label,
              weakness_score: zone.weakness_score,
              coverage: zone.coverage,
            }))}
            xgZones={xgZones.map((zone) => ({
              x: zone.x,
              y: zone.y,
              xg_value: zone.xg_value,
              shot_count: zone.shot_count,
            }))}
            vulnerability={vulnerability}
            keyMetrics={summary?.key_metrics}
            keyPlayer={keyPlayerDep}
            counterRisk={counterRisk}
            homeFormation={summary?.formations_detected?.home || "4-3-3"}
            awayFormation={summary?.formations_detected?.away || "4-3-3"}
          />
        </div>

        <div className="space-y-6">
          {summary?.formations_detected ? (
            <>
              <FormationDisplay
                formation={summary.formations_detected.home || "N/A"}
                teamName="Équipe domicile"
                teamColor="home"
              />
              <FormationDisplay
                formation={summary.formations_detected.away || "N/A"}
                teamName="Équipe extérieure"
                teamColor="away"
              />
            </>
          ) : (
            <div className="glass-card p-6 text-center text-muted-foreground">
              <p>Formations en cours d'analyse...</p>
            </div>
          )}
        </div>
      </div>

      {/* Compact Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-4">
            Lecture rapide
          </h3>

          {analysis.status === "completed" && summary ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vulnerability && (
                <div className="space-y-2">
                  {[
                    {
                      label: "Ligne défensive",
                      value: vulnerability.defensive_line,
                    },
                    { label: "Milieu", value: vulnerability.midfield },
                    {
                      label: "Ligne offensive",
                      value: vulnerability.attacking_line,
                    },
                  ]
                    .filter((item) => item.value !== undefined)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-muted/40 border border-foreground/5 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center justify-between text-sm font-medium text-foreground/90 mb-1">
                          <span>{item.label}</span>
                          <span>{((item.value || 0) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
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
                      </div>
                    ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 items-start">
                {summary.key_metrics?.possession_zones !== undefined && (
                  <span className="px-3 py-2 rounded-full bg-emerald-900/70 border border-emerald-400/30 text-emerald-50 text-xs font-semibold">
                    Possession • {summary.key_metrics.possession_zones}
                  </span>
                )}
                {summary.key_metrics?.high_pressure_areas !== undefined && (
                  <span className="px-3 py-2 rounded-full bg-orange-900/70 border border-orange-400/30 text-orange-50 text-xs font-semibold">
                    Pression • {summary.key_metrics.high_pressure_areas}
                  </span>
                )}
                {summary.key_metrics?.defensive_vulnerabilities !==
                  undefined && (
                  <span className="px-3 py-2 rounded-full bg-rose-900/70 border border-rose-400/30 text-rose-50 text-xs font-semibold">
                    Faiblesses • {summary.key_metrics.defensive_vulnerabilities}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Génération du résumé en cours...</p>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Top zones de menace
          </h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            {threatZones.slice(0, 2).map((zone, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                <div className="flex-1">
                  <div className="font-medium text-foreground/90">
                    {zone.label || `Zone ${idx + 1}`}
                  </div>
                  <div className="text-xs text-foreground/70">
                    ({Math.round(zone.x)}%, {Math.round(zone.y)}%) •{" "}
                    {(zone.threat_score * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
            {threatZones.length === 0 && (
              <div>Aucune zone de menace détectée</div>
            )}
          </div>
        </div>
      </div>

      {/* Plan de match express (collapsible) */}
      {analysis.status === "completed" && (
        <div className="glass-card p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Plan de match (5 lignes)
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPlanOpen((v) => !v)}
            >
              {planOpen ? "Masquer" : "Afficher"}
            </Button>
          </div>

          {planOpen && (
            <ul className="space-y-2 text-sm text-foreground/90 list-disc list-inside">
              <li>
                Menace principale :
                {topThreat?.threat_score
                  ? ` ${Math.round(topThreat.threat_score * 100)}%`
                  : " forte"}
                {topThreat
                  ? ` autour de (${Math.round(topThreat.x)}%, ${Math.round(
                      topThreat.y
                    )}%)`
                  : " dans l'axe"}
                .
              </li>
              <li>
                Point faible à exploiter : {topWeakness?.label || "gap latéral"}
                {topWeakness?.coverage
                  ? ` • couverture ${Math.round(topWeakness.coverage * 100)}%`
                  : ""}
                .
              </li>
              <li>
                Créer en zone xG :{" "}
                {topXg?.xg_value
                  ? `xG ${topXg.xg_value.toFixed(2)}`
                  : "zone prioritaire"}
                {topXg
                  ? ` (${Math.round(topXg.x)}%, ${Math.round(topXg.y)}%)`
                  : ""}
                .
              </li>
              <li>
                Joueur clé adverse :
                {keyPlayerDep?.number ? ` #${keyPlayerDep.number}` : " meneur"}
                {keyPlayerDep?.involvement_pct
                  ? ` • ${Math.round(
                      keyPlayerDep.involvement_pct * 100
                    )}% des actions`
                  : " à surveiller"}
                .
              </li>
              <li>
                Transition : éviter la perte au milieu
                {counterRisk?.risk_score
                  ? ` • risque ${Math.round(counterRisk.risk_score * 100)}%`
                  : " • risque élevé"}
                .
              </li>
            </ul>
          )}
        </div>
      )}
    </MainLayout>
  );
}
