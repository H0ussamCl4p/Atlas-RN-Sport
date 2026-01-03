/**
 * Landing Page
 * 
 * Premium SaaS landing page for Atlas.
 * Matches dashboard design system with high-end animations.
 * Optimized for hackathon demo and real product launch.
 * 
 * Features:
 * - SEO-optimized metadata
 * - Scroll-based parallax effects
 * - Animated pitch lines
 * - Mobile-first responsive design
 */

import { motion } from 'framer-motion';
import { Brain, Flame, Users, Zap, TrendingUp, Eye, Target } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { ThreeDShowcase } from '@/components/landing/ThreeDShowcase';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { SEO } from '@/components/seo/SEO';
import { 
  featureContainerVariants, 
  valuePropVariants, 
  stepVariants,
  prefersReducedMotion 
} from '@/animations/landingVariants';
import { responsiveTypography } from '@/styles/typography';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* SEO Metadata */}
      <SEO 
        title="Atlas — L'intelligence tactique du football par l'IA"
        description="Atlas transforme les matchs de football en intelligence tactique grâce à l'IA. Analysez, visualisez et décidez mieux."
        url="https://atlas-football.com"
      />

      {/* Hero Section */}
      <Hero />

      {/* 3D Showcase */}
      <ThreeDShowcase />

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className={`${responsiveTypography.title} mb-4`}>
              Tout ce dont vous avez besoin
            </h2>
            <p className={`${responsiveTypography.body} text-muted-foreground max-w-2xl mx-auto`}>
              Des outils professionnels pour des décisions tactiques éclairées
            </p>
          </motion.div>

          <motion.div
            variants={prefersReducedMotion ? {} : featureContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <FeatureCard
              icon={Brain}
              title="Analyse tactique par IA"
              description="Notre IA analyse chaque mouvement, identifie les patterns et révèle les opportunités tactiques invisibles à l'œil nu."
              index={0}
            />
            <FeatureCard
              icon={Flame}
              title="Heatmaps dynamiques"
              description="Visualisez l'intensité du jeu en temps réel avec des heatmaps précis pour chaque joueur et zone du terrain."
              index={1}
            />
            <FeatureCard
              icon={Users}
              title="Vision coach & analyste"
              description="Interface adaptée aux besoins des coachs et analystes. Partagez vos insights avec l'équipe en un clic."
              index={2}
            />
            <FeatureCard
              icon={Zap}
              title="Insights instantanés"
              description="Obtenez des rapports exploitables en moins de 5 minutes. Passez moins de temps à analyser, plus à décider."
              index={3}
            />
          </motion.div>

          {/* Additional features row */}
          <motion.div
            variants={prefersReducedMotion ? {} : featureContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-6 mt-6 max-w-5xl mx-auto"
          >
            <FeatureCard
              icon={TrendingUp}
              title="Évolution performance"
              description="Suivez les progrès de votre équipe match après match avec des graphiques détaillés."
              index={0}
            />
            <FeatureCard
              icon={Eye}
              title="Détection automatique"
              description="Identification automatique des joueurs, ballon, et événements clés du match."
              index={1}
            />
            <FeatureCard
              icon={Target}
              title="Formation & tactiques"
              description="Analysez les formations adverses et ajustez votre stratégie en conséquence."
              index={2}
            />
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            variants={prefersReducedMotion ? {} : valuePropVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-5xl mx-auto text-center"
          >
            <p className="text-sm uppercase tracking-wider text-primary font-semibold mb-6 md:mb-8">
              La différence Atlas
            </p>
            <h2 className="font-display text-display-lg md:text-display-xl lg:text-display-2xl leading-tight mb-6 md:mb-8">
              Du match brut
              <br />
              à la décision
              <br />
              <span className="text-primary">tactique</span>
            </h2>
            <p className={`${responsiveTypography.body} text-muted-foreground max-w-3xl mx-auto leading-relaxed`}>
              Atlas transforme des heures de vidéo en insights actionnables. 
              Concentrez-vous sur ce qui compte : gagner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className={`${responsiveTypography.title} mb-4`}>
              Simple et puissant
            </h2>
            <p className={`${responsiveTypography.body} text-muted-foreground max-w-2xl mx-auto`}>
              Trois étapes pour transformer votre analyse tactique
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {/* Step 1 */}
            <motion.div
              custom={0}
              variants={prefersReducedMotion ? {} : stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-6 md:p-8 bg-card border-2 border-border rounded-2xl hover:border-primary/50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div>
                <h3 className={`${responsiveTypography.subtitle} mb-2`}>Importez le match</h3>
                <p className={`${responsiveTypography.body} text-muted-foreground leading-relaxed`}>
                  Glissez-déposez votre vidéo. Tous les formats acceptés. 
                  Pas de configuration compliquée.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              custom={1}
              variants={prefersReducedMotion ? {} : stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-6 md:p-8 bg-card border-2 border-border rounded-2xl hover:border-primary/50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div>
                <h3 className={`${responsiveTypography.subtitle} mb-2`}>Atlas analyse</h3>
                <p className={`${responsiveTypography.body} text-muted-foreground leading-relaxed`}>
                  L'IA détecte automatiquement joueurs, mouvements, et événements clés. 
                  En quelques minutes.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              custom={2}
              variants={prefersReducedMotion ? {} : stepVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-6 md:p-8 bg-card border-2 border-border rounded-2xl hover:border-primary/50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div>
                <h3 className={`${responsiveTypography.subtitle} mb-2`}>Décidez mieux</h3>
                <p className={`${responsiveTypography.body} text-muted-foreground leading-relaxed`}>
                  Consultez les insights exploitables et prenez des décisions basées sur les données.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <footer className="py-8 sm:py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-xl sm:text-2xl font-bold">Atlas</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                L'intelligence tactique du football
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">
                Fonctionnalités
              </a>
              <a href="#" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">
                Tarifs
              </a>
              <a href="#" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">
                Documentation
              </a>
              <a href="#" className="hover:text-foreground transition-colors min-h-[44px] flex items-center">
                Contact
              </a>
            </div>
          </div>
          
          <div className="text-center mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground">
            <p>© 2026 Atlas. Propulsé par l'IA. Conçu pour les champions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
