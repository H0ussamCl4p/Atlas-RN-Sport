import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, Upload, Activity, ShieldAlert, Crosshair } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'egnn' | 'heatmap' | 'events'>('egnn');

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Full-bleed top horizontal architectural line (ReadMe signature) */}
      <div className="pointer-events-none w-full h-px bg-border" />

      <div className="px-4 sm:px-6">
        <div className="relative mx-auto max-w-[1232px]">
          {/* Vertical Side Labels (Desktop) */}
          <div className="hidden xl:flex pointer-events-none absolute -left-28 top-1/3 -rotate-90 items-center">
            <span className="rounded-full bg-background border border-border px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Computer Vision + EGNN
            </span>
          </div>
          <div className="hidden xl:flex pointer-events-none absolute -right-28 top-1/3 rotate-90 items-center">
            <span className="rounded-full bg-background border border-border px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Tactical Intelligence Stack
            </span>
          </div>

          {/* ReadMe-inspired Rounded Dark Green Hero Stage */}
          <div className="relative overflow-hidden rounded-[32px] xl:rounded-[48px] bg-[#0B3D2E] text-white pt-14 pb-44 xl:pt-12 xl:pb-52 px-6 sm:px-12 shadow-lg">
            {/* Subtle internal grid inside dark green stage */}
            <div
              className="pointer-events-none absolute inset-0 opacity-15"
              style={{
                backgroundSize: '48px 48px',
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)',
              }}
            />

            {/* Radial mint glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[360px] rounded-full bg-emerald-400/15 blur-3xl" />

            {/* Top Curved White Notch SVG (ReadMe signature detail) */}
            <svg
              className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2"
              fill="none"
              height="42"
              viewBox="0 0 128 50"
              width="112"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M85.8404 14.3597C94.3969 10 105.598 10 128 10V0H0V10C22.4021 10 33.6031 10 42.1596 14.3597C49.6861 18.1947 55.8053 24.3139 59.6403 31.8404C62.0208 36.5125 63.1015 41.9732 63.5921 49.6153C63.6059 49.8305 63.7844 50 64 50C64.2156 50 64.3941 49.8305 64.4079 49.6153C64.8985 41.9732 65.9792 36.5125 68.3597 31.8404C72.1947 24.3139 78.3139 18.1947 85.8404 14.3597Z"
                fill="hsl(var(--background))"
              />
            </svg>

            {/* Top Announcement Pill */}
            <div className="relative z-10 flex justify-center mt-6 mb-8">
              <button
                onClick={() => navigate('/upload')}
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#072A20] border border-emerald-400/25 p-1 pr-4 text-xs sm:text-sm text-emerald-50 hover:border-emerald-400/50 transition-colors"
              >
                <span className="rounded-full bg-[#6EE7B7] px-2.5 py-0.5 text-[11px] font-semibold text-[#072A20]">
                  EGNN v2
                </span>
                <span className="font-medium">
                  Analyse vidéo, tracking 25Hz &amp; intelligence tactique
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#6EE7B7] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Main Headline */}
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h1 className="font-heading font-extrabold text-4xl sm:text-6xl xl:text-[68px] tracking-tight leading-[1.04] text-white mb-6">
                L'intelligence tactique <br className="hidden sm:block" />
                conçue pour les{' '}
                <span className="text-[#6EE7B7] underline decoration-emerald-400/40 decoration-2 underline-offset-8">
                  analystes
                </span>
              </h1>
              <p className="text-base sm:text-xl text-emerald-100/85 max-w-2xl mx-auto leading-relaxed mb-10">
                Transformez vos vidéos de match et flux de tracking en graphes spatio-temporels,
                zones de vulnérabilité et décisions exploitables par le staff.
              </p>

              {/* Floating White Command / Action Pill Bar (ReadMe signature centerpiece) */}
              <div className="mx-auto max-w-2xl rounded-[28px] bg-white p-2 sm:p-2.5 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-foreground">
                <div className="flex items-center gap-2 rounded-full bg-secondary px-3.5 py-2 text-xs font-semibold text-primary shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Pipeline IA</span>
                </div>

                <div className="flex-1 px-3 py-1.5 text-left font-mono text-xs text-muted-foreground truncate">
                  <span className="text-foreground font-medium">Entrée :</span> Vidéo MP4 · Tracking 25Hz · Modèle EGNN
                </div>

                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
                >
                  <span>Analyser un match</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Secondary Quick Links below Pill Bar */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-emerald-100/80">
                <span>Ou</span>
                <button
                  onClick={() => navigate('/upload')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-[#072A20]/60 px-3.5 py-1.5 text-white hover:border-emerald-300/50 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-[#6EE7B7]" />
                  <span>Importer une vidéo MP4</span>
                </button>
                <span>ou</span>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/25 bg-[#072A20]/60 px-3.5 py-1.5 text-white hover:border-emerald-300/50 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-[#6EE7B7]" />
                  <span>Explorer la démo interactive</span>
                </button>
              </div>
            </div>
          </div>

          {/* Overlapping Elevated White Workbench Card (ReadMe signature lower showcase) */}
          <div className="relative z-20 mx-auto max-w-[1120px] -mt-32 xl:-mt-36 px-2 sm:px-6 pb-16">
            <div className="rounded-[24px] bg-card border border-border shadow-2xl overflow-hidden">
              {/* Top Window Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-b border-border bg-secondary/50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="font-mono text-xs font-medium text-foreground">
                    ATLAS TACTICAL WORKBENCH // 105m × 68m
                  </span>
                </div>

                {/* Interactive Mode Tabs */}
                <div className="flex items-center gap-1 rounded-full bg-background p-1 border border-border">
                  <button
                    onClick={() => setActiveTab('egnn')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeTab === 'egnn'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Graphe EGNN
                  </button>
                  <button
                    onClick={() => setActiveTab('heatmap')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeTab === 'heatmap'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Zones de vulnérabilité
                  </button>
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      activeTab === 'events'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Flux xG &amp; Transitions
                  </button>
                </div>
              </div>

              {/* Workbench Body */}
              <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border">
                {/* Left Telemetry Column */}
                <div className="lg:col-span-4 p-6 space-y-5 bg-background/60">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Formation détectée
                    </span>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="font-heading text-2xl font-bold text-foreground">
                        4-3-3 vs 4-2-3-1
                      </span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-primary">
                        22 joueurs
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-border">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Vulnérabilité par ligne (EGNN)
                    </span>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-foreground">Ligne défensive</span>
                        <span className="font-mono text-muted-foreground">34%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full w-[34%] bg-primary rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-foreground">Milieu de terrain (Demi-espace)</span>
                        <span className="font-mono text-amber-600 font-semibold">68%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full w-[68%] bg-amber-500 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-foreground">Risque de contre-attaque</span>
                        <span className="font-mono text-rose-600 font-semibold">74%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full w-[74%] bg-rose-500 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Crosshair className="w-3.5 h-3.5 text-primary" />
                        <span>Menace xG</span>
                      </div>
                      <div className="font-heading text-xl font-bold text-foreground">0.64 xG</div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        <span>Surcharge</span>
                      </div>
                      <div className="font-heading text-xl font-bold text-foreground">3v2 Aile G</div>
                    </div>
                  </div>
                </div>

                {/* Right 2D Tactical Pitch Visualization */}
                <div className="lg:col-span-8 p-6 bg-card flex flex-col justify-between">
                  <div className="relative rounded-xl overflow-hidden border border-border bg-[#0C3B2E] aspect-[16/10]">
                    <svg viewBox="0 0 320 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      {/* Pitch Lines */}
                      <rect x="10" y="10" width="300" height="180" rx="3" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                      <line x1="160" y1="10" x2="160" y2="190" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                      <circle cx="160" cy="100" r="26" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                      <rect x="10" y="52" width="42" height="96" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                      <rect x="268" y="52" width="42" height="96" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />

                      {/* Dynamic Overlays based on selected tab */}
                      {(activeTab === 'heatmap' || activeTab === 'egnn') && (
                        <>
                          <circle cx="215" cy="68" r="28" fill="rgba(244, 63, 94, 0.22)" stroke="rgba(244, 63, 94, 0.65)" strokeDasharray="3 3" />
                          <circle cx="185" cy="134" r="24" fill="rgba(110, 231, 183, 0.18)" stroke="rgba(110, 231, 183, 0.55)" />
                        </>
                      )}

                      {activeTab === 'events' && (
                        <g stroke="#FBBF24" strokeWidth="1.8" strokeDasharray="4 2">
                          <line x1="135" y1="68" x2="215" y2="68" />
                          <line x1="185" y1="134" x2="248" y2="104" />
                        </g>
                      )}

                      {/* EGNN Edges */}
                      <g stroke="rgba(110, 231, 183, 0.42)" strokeWidth="1.1">
                        <line x1="72" y1="52" x2="135" y2="68" />
                        <line x1="72" y1="100" x2="135" y2="68" />
                        <line x1="72" y1="100" x2="140" y2="128" />
                        <line x1="72" y1="148" x2="140" y2="128" />
                        <line x1="135" y1="68" x2="185" y2="134" />
                        <line x1="135" y1="68" x2="215" y2="68" />
                        <line x1="140" y1="128" x2="185" y2="134" />
                        <line x1="185" y1="134" x2="248" y2="104" />
                      </g>

                      {/* Home Team Nodes */}
                      <g fill="#6EE7B7" stroke="#072A20" strokeWidth="1.5">
                        <circle cx="26" cy="100" r="5" />
                        <circle cx="72" cy="52" r="5" />
                        <circle cx="72" cy="100" r="5" />
                        <circle cx="72" cy="148" r="5" />
                        <circle cx="135" cy="68" r="5.5" />
                        <circle cx="140" cy="128" r="5.5" />
                        <circle cx="185" cy="134" r="6" />
                        <circle cx="215" cy="68" r="6" />
                        <circle cx="248" cy="104" r="6" />
                      </g>

                      {/* Away Team Nodes */}
                      <g fill="#FFFFFF" stroke="#072A20" strokeWidth="1.5">
                        <circle cx="294" cy="100" r="5" />
                        <circle cx="255" cy="58" r="5" />
                        <circle cx="252" cy="100" r="5" />
                        <circle cx="255" cy="144" r="5" />
                        <circle cx="195" cy="50" r="5" />
                        <circle cx="198" cy="102" r="5" />
                        <circle cx="172" cy="156" r="5" />
                      </g>
                    </svg>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                        Domicile (4-3-3)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                        Extérieur (4-2-3-1)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                        Brèche défensive (Zone W1)
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-primary flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" />
                      Inférence PyTorch EGNN active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-bleed bottom horizontal architectural line */}
      <div className="pointer-events-none w-full h-px bg-border" />
    </section>
  );
}
