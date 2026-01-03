/**
 * Landing Page
 * 
 * Professional football analytics platform landing.
 * Editorial design, data-driven visuals, minimal aesthetic.
 * 
 * DESIGN PHILOSOPHY:
 * - Typography as main design tool
 * - Football-native SVG visuals (no photos)
 * - Asymmetrical editorial layouts
 * - Calm, confident animations
 * - Data > decoration
 */

import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Network, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { ScrollIndicator } from '@/components/landing/ScrollIndicator';
import { ScrollToTop } from '@/components/landing/ScrollToTop';
import { Hero } from '@/components/landing/Hero';
import { Section, SectionHeader, SectionSeparator } from '@/components/landing/Section';
import { HeatmapBlock } from '@/components/landing/HeatmapBlock';
import { NodeGraph } from '@/components/landing/NodeGraph';
import { DataVisual } from '@/components/landing/DataVisual';
import { SEO } from '@/components/seo/SEO';
import { cardVariants, prefersReducedMotion } from '@/animations/analyticalVariants';
import { grid } from '@/styles/spacing';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Metadata */}
      <SEO 
        title="Atlas — L'intelligence tactique du football par l'IA"
        description="Plateforme d'analyse tactique professionnelle. Transformez vos matchs en données exploitables avec l'IA."
        url="https://atlas-football.com"
      />

      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <Hero />

      {/* Scroll Indicator */}
      <ScrollIndicator targetSectionId="features" />

      {/* Scroll To Top Button */}
      <ScrollToTop showAfter={400} />

      {/* Capabilities Section - Asymmetrical */}
      <Section spacing="desktop" id="features">
        <SectionHeader
          title="Analyse tactique de niveau professionnel"
          subtitle="Des outils conçus pour les coachs et analystes qui exigent la précision"
          align="left"
        />

        {/* Text + Visual Grid */}
        <div className={grid.asymmetrical.textLeft}>
          <div className={grid.asymmetrical.textSpan + " space-y-8"}>
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Détection automatique
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Notre IA identifie joueurs, formations et mouvements tactiques en temps réel.
                Analyse complète en moins de 5 minutes.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Heatmaps de précision
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualisez l'intensité du jeu par zone. Identifiez les déséquilibres,
                les espaces exploitables, les patterns de pression.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Insights tactiques
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Rapports détaillés sur les phases de jeu, transitions, organisation défensive.
                Données exploitables pour la préparation de match.
              </p>
            </div>
          </div>

          <div className={grid.asymmetrical.visualSpan}>
            <HeatmapBlock />
          </div>
        </div>
      </Section>

      <SectionSeparator />

      {/* Data Section - Reversed Asymmetry */}
      <Section spacing="desktop" id="methodology">
        <div className={grid.asymmetrical.textRight}>
          <div className={grid.asymmetrical.visualSpan + " order-2 md:order-1"}>
            <NodeGraph />
          </div>

          <div className={grid.asymmetrical.textSpan + " order-1 md:order-2 space-y-8"}>
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Réseau de passes
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Analysez les connexions entre joueurs. Identifiez les porteurs de ballon clés,
                les triangles de construction, les circuits de jeu préférentiels.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Positionnement tactique
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Comprenez les mouvements collectifs, les rotations, les compensations.
                Visualisez la structure tactique réelle de votre équipe.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Cohésion d'équipe
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Mesurez les distances entre lignes, la compacité, l'équilibre positionnel.
                Optimisez l'organisation collective.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <SectionSeparator />

      {/* Metrics Section */}
      <Section spacing="tablet">
        <SectionHeader
          title="Des métriques qui comptent"
          subtitle="Toutes les données tactiques essentielles, visualisées clairement"
        />

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <DataVisual
            type="bar"
            title="Performance tactique"
            data={[
              { label: 'Possession', value: 62 },
              { label: 'Passes', value: 78 },
              { label: 'Duels', value: 45 },
              { label: 'Pressing', value: 71 },
            ]}
          />

          <DataVisual
            type="bar"
            title="Zones d'efficacité"
            data={[
              { label: 'Tiers offensif', value: 58 },
              { label: 'Tiers médian', value: 72 },
              { label: 'Tiers défensif', value: 81 },
              { label: 'Transitions', value: 65 },
            ]}
          />
        </div>
      </Section>

      <SectionSeparator />

      {/* Features Grid */}
      <Section spacing="tablet" background="subtle">
        <SectionHeader
          title="Plateforme complète"
          subtitle="Tout ce dont vous avez besoin pour analyser le football moderne"
        />

        <div className={grid.features}>
          <motion.div
            custom={0}
            {...(!prefersReducedMotion && {
              initial: "hidden",
              whileInView: "visible",
              variants: cardVariants,
            })}
            viewport={{ once: true, margin: '-50px' }}
            className="p-8 border border-border/50 rounded-lg bg-card/30"
          >
            <BarChart3 className="w-8 h-8 text-primary mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Analyse vidéo IA
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Traitement automatique de vos matchs. Détection des événements,
              tracking des joueurs, classification des phases de jeu.
            </p>
          </motion.div>

          <motion.div
            custom={1}
            {...(!prefersReducedMotion && {
              initial: "hidden",
              whileInView: "visible",
              variants: cardVariants,
            })}
            viewport={{ once: true, margin: '-50px' }}
            className="p-8 border border-border/50 rounded-lg bg-card/30"
          >
            <Network className="w-8 h-8 text-primary mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Rapports tactiques
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Générez des rapports détaillés. Partagez avec votre staff.
              Exportez en PDF pour la préparation de match.
            </p>
          </motion.div>

          <motion.div
            custom={2}
            {...(!prefersReducedMotion && {
              initial: "hidden",
              whileInView: "visible",
              variants: cardVariants,
            })}
            viewport={{ once: true, margin: '-50px' }}
            className="p-8 border border-border/50 rounded-lg bg-card/30"
          >
            <Zap className="w-8 h-8 text-primary mb-6" />
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Analyse instantanée
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Résultats en 5 minutes. Pas d'attente. Décisions tactiques
              prises rapidement, basées sur des données fiables.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Final CTA - Minimal, Institutional */}
      <Section spacing="desktop" id="cta">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight leading-tight">
            Transformez votre
            <br />
            approche tactique
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Rejoignez les clubs qui utilisent Atlas pour prendre des décisions
            basées sur les données, pas sur l'intuition.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-lg rounded-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              Commencer avec Atlas
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-3 px-8 py-4 border border-border text-foreground font-medium text-lg rounded-sm hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              Se connecter
            </button>
          </div>

          <p className="text-sm text-muted-foreground/70">
            Configuration en 5 minutes · Analyse illimitée · Support expert
          </p>
        </div>
      </Section>

      {/* Footer - Minimal, Institutional */}
      <footer className="border-t border-border/50 bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Logo & Tagline */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-foreground mb-2">Atlas</h3>
              <p className="text-sm text-muted-foreground">
                L'intelligence tactique du football
              </p>
            </div>

            {/* Links */}
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                  Produit
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Tarifs</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                  Entreprise
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">À propos</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Carrières</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                  Ressources
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Guide tactique</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                  Légal
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Conditions</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Sécurité</a></li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground/70">
                © 2026 Atlas. Plateforme d'analyse tactique professionnelle.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
