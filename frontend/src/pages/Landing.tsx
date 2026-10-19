import { ArrowRight, BarChart3, Network, Zap, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { ScrollToTop } from '@/components/landing/ScrollToTop';
import { Hero } from '@/components/landing/Hero';
import { HeatmapBlock } from '@/components/landing/HeatmapBlock';
import { NodeGraph } from '@/components/landing/NodeGraph';
import { DataVisual } from '@/components/landing/DataVisual';
import { SEO } from '@/components/seo/SEO';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Atlas — L'intelligence tactique du football par l'IA"
        description="Plateforme d'analyse tactique professionnelle. Transformez vos matchs en données exploitables avec l'IA."
        url="https://atlas-football.com"
      />

      <LandingNavbar />

      <Hero />

      <ScrollToTop showAfter={400} />

      {/* Section 01: Capabilities — ReadMe-style architectural border-x container */}
      <section id="features" className="relative border-b border-border">
        <div className="mx-auto max-w-[1160px] border-x border-border px-6 sm:px-12 py-20 md:py-28">
          <div className="max-w-3xl mb-16">
            <span className="font-mono-eyebrow text-primary block mb-3">
              01 // Perception &amp; Spatial Mapping
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Analyse tactique de niveau professionnel
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Des outils conçus pour les coachs, analystes vidéo et directions sportives qui exigent une précision géométrique.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Détection &amp; Tracking automatisés
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Identification des joueurs, formations et trajectoires en temps réel par vision par ordinateur et projection homographique 105m × 68m.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Heatmaps de pression et d'occupation
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Visualisez l'intensité du jeu par zone, identifiez les déséquilibres défensifs et détectez les demi-espaces exploitables.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Rapports d'avant-match exploitables
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Synthèses structurées sur les transitions, la dépendance au joueur clé et les vulnérabilités par ligne.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-4 rounded-2xl bg-card border border-border shadow-md">
                <HeatmapBlock />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Graph Intelligence */}
      <section id="methodology" className="relative border-b border-border readme-grid-bg">
        <div className="mx-auto max-w-[1160px] border-x border-border bg-background/90 backdrop-blur-sm px-6 sm:px-12 py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="p-4 rounded-2xl bg-card border border-border shadow-md">
                <NodeGraph />
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="font-mono-eyebrow text-primary block">
                02 // Equivariant Graph Neural Networks
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Modélisation par graphe des dynamiques collectives
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Chaque joueur est modélisé comme un nœud connecté à ses partenaires et adversaires proches pour quantifier la structure collective au-delà des statistiques individuelles.
              </p>

              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Réseau de passes &amp; centralité :</strong> identifiez le chef d'orchestre et les circuits préférentiels.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Compacité inter-lignes :</strong> mesurez l'étirement du bloc défensif et médian sous pression.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>Prédiction multi-tâches :</strong> score de vulnérabilité par ligne, menace xG et risque de transition.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 03: Metrics & Bento Grid */}
      <section id="metrics" className="relative border-b border-border">
        <div className="mx-auto max-w-[1160px] border-x border-border px-6 sm:px-12 py-20 md:py-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono-eyebrow text-primary block mb-3">
              03 // Key Performance Telemetry
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Des métriques qui comptent sur le terrain
            </h2>
            <p className="text-base text-muted-foreground">
              Toutes les données tactiques essentielles, agrégées et hiérarchisées pour une lecture immédiate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
              <DataVisual
                type="bar"
                title="Performance tactique collective"
                data={[
                  { label: 'Possession structurée', value: 62 },
                  { label: 'Passes cassant des lignes', value: 78 },
                  { label: 'Compacité défensive', value: 84 },
                  { label: 'Intensité du pressing', value: 71 },
                ]}
              />
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
              <DataVisual
                type="bar"
                title="Contrôle spatial par zone"
                data={[
                  { label: 'Tiers offensif', value: 58 },
                  { label: 'Demi-espaces médians', value: 76 },
                  { label: 'Protection axe central', value: 81 },
                  { label: 'Sécurité en transition', value: 65 },
                ]}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-secondary/60 border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-5">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Analyse vidéo &amp; Tracking
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prise en charge des vidéos de match MP4 ainsi que des flux de coordonnées 25Hz et données d'événements.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-secondary/60 border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-5">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Inférence GNN Explicable
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Localisation directe des surcharges numériques, espaces libres et joueurs clés adverses.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-secondary/60 border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-5">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Décision en temps réel
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interface fluide pensée pour la préparation d'avant-match et l'analyse vidéo à la mi-temps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA — ReadMe-style rounded dark green callout banner */}
      <section id="cta" className="relative border-b border-border">
        <div className="mx-auto max-w-[1160px] border-x border-border px-6 sm:px-12 py-20">
          <div className="rounded-[32px] bg-[#0B3D2E] text-white p-10 sm:p-16 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-block rounded-full bg-[#072A20] border border-emerald-400/30 px-3.5 py-1 font-mono text-xs text-[#6EE7B7] uppercase tracking-wider">
                Prêt pour le terrain
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                Transformez votre approche tactique dès aujourd'hui
              </h2>
              <p className="text-base sm:text-lg text-emerald-100/80">
                Accédez au tableau de bord analytique, importez vos séquences vidéo et explorez les modèles tactiques d'Atlas.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#0B3D2E] px-7 py-3.5 text-sm font-bold hover:bg-emerald-50 transition-colors shadow-md"
                >
                  <span>Créer un compte</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-[#072A20]/60 text-white px-7 py-3.5 text-sm font-semibold hover:border-emerald-300/60 transition-colors"
                >
                  <span>Se connecter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background">
        <div className="mx-auto max-w-[1160px] border-x border-border px-6 sm:px-12 py-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#6EE7B7]" />
            </div>
            <span className="font-heading font-bold text-foreground">Atlas</span>
            <span>— Plateforme d'intelligence tactique du football</span>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            RNSport · Barça Innovation Hub · Microsoft Inside the Game
          </div>
        </div>
      </footer>
    </div>
  );
}
