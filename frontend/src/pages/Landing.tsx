import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { ScrollToTop } from '@/components/landing/ScrollToTop';
import { Hero } from '@/components/landing/Hero';
import { HeatmapBlock } from '@/components/landing/HeatmapBlock';
import { NodeGraph } from '@/components/landing/NodeGraph';
import { SEO } from '@/components/seo/SEO';

const TEAM_MEMBERS = [
  {
    name: 'Houssam Choubik',
    role: 'Cloud, Security & Full-Stack Architecture',
    school: 'ENSAM Casablanca',
    avatar: 'https://avatars.githubusercontent.com/u/178616882?v=4',
    tags: ['System Architecture', 'CV & GNN Pipeline', 'FastAPI / React'],
    linkedin: 'https://www.linkedin.com/in/houssam-choubik/',
    github: 'https://github.com/H0ussamCl4p',
    portfolio: 'https://houssamc-portfolio.vercel.app',
    portfolioLabel: 'Portfolio',
  },
  {
    name: 'Lyna Benlakhbaizi',
    role: 'AI & Data Science Engineering',
    school: 'ENSAM Casablanca',
    avatar: 'https://avatars.githubusercontent.com/u/157243525?v=4',
    tags: ['Tactical Metrics', 'Spatial Analytics', 'Data Engineering'],
    linkedin: 'https://www.linkedin.com/in/lynabenlakhbaizi/',
    github: 'https://github.com/lynashere',
  },
  {
    name: 'Salwa Khattami',
    role: 'ML & Graph Neural Networks',
    school: 'ENSAM Casablanca',
    avatar: 'https://avatars.githubusercontent.com/u/91611070?v=4',
    tags: ['EGNN Architecture', 'PyTorch Inference', 'AI Microservice'],
    linkedin: 'https://www.linkedin.com/in/salwa-khattami/fr/',
    github: 'https://github.com/Salwa08',
    portfolio: 'https://huggingface.co/PhoenixA',
    portfolioLabel: 'Hugging Face',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="ATLAS — Football Tactical Intelligence"
        description="Computer vision, 2D homography projection, and 6-head Equivariant Graph Neural Networks for football tactical analysis."
        url="https://atlas-football.com"
      />

      <LandingNavbar />

      <Hero />

      <ScrollToTop showAfter={400} />

      {/* Section 01: End-to-End Pipeline Diagram */}
      <section id="features" className="relative border-b border-border">
        <div className="mx-auto max-w-[1160px] border-x border-border px-6 sm:px-12 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-mono-eyebrow text-primary block mb-2">
                01 // HOW IT WORKS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                End-to-End Tactical Inference Pipeline
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              From broadcast video or tracking CSVs to 6 simultaneous graph predictions per frame in 34ms.
            </p>
          </div>

          {/* Pipeline SVG Diagram */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm overflow-x-auto">
            <svg
              viewBox="0 0 1040 260"
              className="w-full h-auto min-w-[780px] block"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="pipeline-arrow"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#0B3D2E" />
                </marker>
              </defs>

              {/* Stage 1 */}
              <rect x="10" y="20" width="180" height="220" rx="14" fill="#F2F7F4" stroke="#DDE5DF" strokeWidth="1.5" />
              <text x="28" y="48" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#0B3D2E">01 // INPUT</text>
              <text x="28" y="70" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="700" fill="#0D1F18">Match Streams</text>
              <rect x="24" y="88" width="152" height="58" rx="8" fill="#FFFFFF" stroke="#DDE5DF" />
              <text x="36" y="110" fontFamily="Inter, sans-serif" fontSize="11.5" fontWeight="600" fill="#0D1F18">Broadcast Video</text>
              <text x="36" y="128" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#6C8279">1080p @ 25/30 FPS</text>
              <rect x="24" y="158" width="152" height="62" rx="8" fill="#FFFFFF" stroke="#DDE5DF" />
              <text x="36" y="180" fontFamily="Inter, sans-serif" fontSize="11.5" fontWeight="600" fill="#0D1F18">Optical &amp; Event CSV</text>
              <text x="36" y="198" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#6C8279">Metrica / SkillCorner</text>

              <line x1="190" y1="130" x2="224" y2="130" stroke="#0B3D2E" strokeWidth="1.8" markerEnd="url(#pipeline-arrow)" />

              {/* Stage 2 */}
              <rect x="230" y="20" width="210" height="220" rx="14" fill="#F2F7F4" stroke="#DDE5DF" strokeWidth="1.5" />
              <text x="248" y="48" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#0B3D2E">02 // PERCEPTION</text>
              <text x="248" y="70" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="700" fill="#0D1F18">CV &amp; Homography</text>
              <rect x="244" y="88" width="182" height="42" rx="8" fill="#FFFFFF" stroke="#DDE5DF" />
              <text x="256" y="108" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="#0D1F18">YOLO + ByteTrack</text>
              <text x="256" y="122" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill="#6C8279">Player &amp; Ball IDs</text>
              <rect x="244" y="138" width="182" height="42" rx="8" fill="#FFFFFF" stroke="#DDE5DF" />
              <text x="256" y="158" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="#0D1F18">SigLIP + UMAP + KMeans</text>
              <text x="256" y="172" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill="#6C8279">Zero-shot Team Clustering</text>
              <rect x="244" y="188" width="182" height="38" rx="8" fill="#E6F2EE" stroke="#0B3D2E" strokeOpacity="0.3" />
              <text x="256" y="211" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#0B3D2E">3&times;3 Homography &rarr; 105&times;68m</text>

              <line x1="440" y1="130" x2="474" y2="130" stroke="#0B3D2E" strokeWidth="1.8" markerEnd="url(#pipeline-arrow)" />

              {/* Stage 3 */}
              <rect x="480" y="20" width="220" height="220" rx="14" fill="#F2F7F4" stroke="#DDE5DF" strokeWidth="1.5" />
              <text x="498" y="48" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#0B3D2E">03 // GRAPH BUILDER</text>
              <text x="498" y="70" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="700" fill="#0D1F18">Pitch Graph G = (V, E)</text>
              <rect x="494" y="88" width="192" height="66" rx="8" fill="#FFFFFF" stroke="#DDE5DF" />
              <text x="506" y="108" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="600" fill="#0B3D2E">Nodes V (dim = 7)</text>
              <text x="506" y="125" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill="#435950">[x, y, vx, vy, team,</text>
              <text x="506" y="140" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill="#435950"> role, pressure_idx]</text>
              <rect x="494" y="162" width="192" height="62" rx="8" fill="#FFFFFF" stroke="#DDE5DF" />
              <text x="506" y="182" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="600" fill="#0B3D2E">Edges E (dim = 2)</text>
              <text x="506" y="199" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill="#435950">[euclidean_dist,</text>
              <text x="506" y="214" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill="#435950"> relative_bearing]</text>

              <line x1="700" y1="130" x2="734" y2="130" stroke="#0B3D2E" strokeWidth="1.8" markerEnd="url(#pipeline-arrow)" />

              {/* Stage 4 */}
              <rect x="740" y="20" width="290" height="220" rx="14" fill="#0B3D2E" />
              <text x="760" y="48" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#6EE7B7">04 // 3-LAYER EGNN (HIDDEN=64)</text>
              <text x="760" y="70" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="700" fill="#FFFFFF">6 Simultaneous Output Heads</text>

              <rect x="756" y="86" width="124" height="40" rx="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
              <text x="766" y="104" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="600" fill="#6EE7B7">fc_formation</text>
              <text x="766" y="117" fontFamily="DM Sans, sans-serif" fontSize="9.5" fill="#FFFFFF">Shape Detection</text>

              <rect x="890" y="86" width="124" height="40" rx="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
              <text x="900" y="104" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="600" fill="#6EE7B7">fc_possession</text>
              <text x="900" y="117" fontFamily="DM Sans, sans-serif" fontSize="9.5" fill="#FFFFFF">Control Probability</text>

              <rect x="756" y="134" width="124" height="40" rx="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
              <text x="766" y="152" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="600" fill="#6EE7B7">fc_overload</text>
              <text x="766" y="165" fontFamily="DM Sans, sans-serif" fontSize="9.5" fill="#FFFFFF">Zone Superiority</text>

              <rect x="890" y="134" width="124" height="40" rx="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
              <text x="900" y="152" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="600" fill="#6EE7B7">fc_vulnerable_line</text>
              <text x="900" y="165" fontFamily="DM Sans, sans-serif" fontSize="9.5" fill="#FFFFFF">Def / Mid / Att (3)</text>

              <rect x="756" y="182" width="124" height="40" rx="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
              <text x="766" y="200" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="600" fill="#6EE7B7">fc_shot</text>
              <text x="766" y="213" fontFamily="DM Sans, sans-serif" fontSize="9.5" fill="#FFFFFF">5s Shot Window</text>

              <rect x="890" y="182" width="124" height="40" rx="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.18)" />
              <text x="900" y="200" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="600" fill="#6EE7B7">fc_xg_threat</text>
              <text x="900" y="213" fontFamily="DM Sans, sans-serif" fontSize="9.5" fill="#FFFFFF">Instant Threat Value</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Section 02: Added Value Diagram & Visuals */}
      <section id="methodology" className="relative border-b border-border readme-grid-bg">
        <div className="mx-auto max-w-[1160px] border-x border-border bg-background/95 px-6 sm:px-12 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-mono-eyebrow text-primary block mb-2">
                02 // ADDED VALUE
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                Why Equivariant Graphs Over Flat Event Logs
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Event logs only record the ball carrier. ATLAS models all 22 off-ball players with rotation and reflection invariance.
            </p>
          </div>

          {/* Comparison SVG Diagram */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm overflow-x-auto mb-8">
            <svg
              viewBox="0 0 980 185"
              className="w-full h-auto min-w-[720px] block"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left: Event Logs */}
              <rect x="10" y="10" width="450" height="165" rx="14" fill="#FAFCFB" stroke="#DDE5DF" strokeWidth="1.5" />
              <text x="30" y="38" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#DC2626">CONVENTIONAL EVENT LOGS (BALL-ONLY)</text>
              <text x="30" y="60" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="700" fill="#0D1F18">Blind to 90% of Pitch Movement</text>
              <rect x="30" y="76" width="170" height="82" rx="8" fill="#F2F7F4" stroke="#DDE5DF" />
              <circle cx="75" cy="115" r="7" fill="#DC2626" />
              <circle cx="120" cy="95" r="5" fill="#CBD5E1" />
              <circle cx="145" cy="130" r="5" fill="#CBD5E1" />
              <circle cx="165" cy="105" r="5" fill="#CBD5E1" />
              <text x="216" y="96" fontFamily="DM Sans, sans-serif" fontSize="12" fill="#435950">&bull; Logs pass/shot coordinates only</text>
              <text x="216" y="118" fontFamily="DM Sans, sans-serif" fontSize="12" fill="#435950">&bull; Misses off-ball defensive line gaps</text>
              <text x="216" y="140" fontFamily="DM Sans, sans-serif" fontSize="12" fill="#435950">&bull; 4&ndash;6h manual post-match video tagging</text>

              {/* Right: ATLAS EGNN */}
              <rect x="500" y="10" width="470" height="165" rx="14" fill="#F2F7F4" stroke="#0B3D2E" strokeWidth="1.8" />
              <text x="520" y="38" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="600" fill="#0B3D2E">ATLAS SPATIO-TEMPORAL EGNN</text>
              <text x="520" y="60" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="700" fill="#0D1F18">Full 22-Player Structural Context</text>
              <rect x="520" y="76" width="170" height="82" rx="8" fill="#FFFFFF" stroke="#0B3D2E" strokeOpacity="0.3" />
              <circle cx="640" cy="112" r="18" fill="rgba(220,38,38,0.15)" stroke="#DC2626" strokeDasharray="2 2" />
              <line x1="555" y1="115" x2="600" y2="95" stroke="#0B3D2E" strokeWidth="1.4" />
              <line x1="555" y1="115" x2="615" y2="135" stroke="#0B3D2E" strokeWidth="1.4" />
              <line x1="600" y1="95" x2="640" y2="112" stroke="#0B3D2E" strokeWidth="1.4" />
              <circle cx="555" cy="115" r="6" fill="#0B3D2E" />
              <circle cx="600" cy="95" r="6" fill="#0B3D2E" />
              <circle cx="615" cy="135" r="6" fill="#0B3D2E" />
              <circle cx="640" cy="112" r="6" fill="#D97706" />
              <text x="706" y="96" fontFamily="DM Sans, sans-serif" fontSize="12" fontWeight="600" fill="#0D1F18">&bull; E(2) Symmetry: 4&times; data efficiency</text>
              <text x="706" y="118" fontFamily="DM Sans, sans-serif" fontSize="12" fontWeight="600" fill="#0D1F18">&bull; Flags Def / Mid / Att line breaches live</text>
              <text x="706" y="140" fontFamily="DM Sans, sans-serif" fontSize="12" fontWeight="600" fill="#0D1F18">&bull; 34ms/frame inference on broadcast video</text>
            </svg>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
              <HeatmapBlock />
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border shadow-sm">
              <NodeGraph />
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Minds Behind the Solution */}
      <section id="metrics" className="relative border-b border-border">
        <div className="mx-auto max-w-[1160px] border-x border-border px-6 sm:px-12 py-16 md:py-24">
          <div className="mb-10">
            <span className="font-mono-eyebrow text-primary block mb-2">
              03 // MINDS BEHIND THE SOLUTION
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              Engineering Team &mdash; ENSAM Casablanca
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((m) => (
              <div
                key={m.name}
                className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-primary bg-secondary shrink-0"
                    />
                    <div>
                      <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                        {m.role}
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{m.name}</h3>
                      <div className="text-xs text-muted-foreground">{m.school}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-secondary border border-border text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {m.portfolio && (
                    <a
                      href={m.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                    >
                      <span>{m.portfolioLabel}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="relative border-b border-border">
        <div className="mx-auto max-w-[1160px] border-x border-border px-6 sm:px-12 py-16">
          <div className="rounded-[28px] bg-[#0B3D2E] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="font-mono text-xs text-[#6EE7B7] uppercase tracking-wider">
                RNSport 2026 &middot; Barça Innovation Hub &middot; Microsoft Inside the Game
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Launch the Tactical Workbench
              </h2>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#0B3D2E] px-6 py-3 text-sm font-bold hover:bg-emerald-50 transition-colors"
              >
                <span>Open Workbench</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-[#072A20]/60 text-white px-6 py-3 text-sm font-semibold hover:border-emerald-300/60 transition-colors"
              >
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background">
        <div className="mx-auto max-w-[1160px] border-x border-border px-6 sm:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="font-semibold text-foreground">
            ATLAS &mdash; ENSAM Casablanca
          </div>
          <div className="font-mono">
            RNSport 2026 &middot; More Than a Hack 2027 &middot; Inside the Game
          </div>
        </div>
      </footer>
    </div>
  );
}
