/**
 * Hero Section Component
 * 
 * Minimal, editorial hero for professional football analytics platform.
 * Strong headline, one powerful sentence, background pitch grid.
 * No decoration - just confident typography and data visualization.
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { 
  textRevealVariants, 
  staggerTextVariants,
  staggerTextChild,
  prefersReducedMotion 
} from '@/animations/analyticalVariants';
import { PitchGrid } from './PitchGrid';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background pitch grid - low opacity */}
      <PitchGrid animate={true} showZones={true} />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 md:py-40">
        <motion.div
          variants={!prefersReducedMotion ? staggerTextVariants : undefined}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Main Headline - editorial, strong */}
          <motion.h1
            variants={!prefersReducedMotion ? staggerTextChild : undefined}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-8 tracking-tight leading-[0.95]"
          >
            L'intelligence tactique
            <br />
            du football,{' '}
            <span className="text-primary">réinventée</span>
          </motion.h1>

          {/* One powerful sentence */}
          <motion.p
            variants={!prefersReducedMotion ? staggerTextChild : undefined}
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl leading-relaxed mb-12"
          >
            Atlas transforme vos matchs en données exploitables.
            <br className="hidden md:block" />
            Analyse automatisée. Insights professionnels. Décisions éclairées.
          </motion.p>

          {/* Single, clear CTA */}
          <motion.div
            variants={!prefersReducedMotion ? staggerTextChild : undefined}
          >
            <button
              onClick={() => navigate('/register')}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium text-lg rounded-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              Découvrir Atlas
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Minimal stats - data emphasis */}
          <motion.div
            variants={!prefersReducedMotion ? staggerTextChild : undefined}
            className="flex gap-12 mt-20 text-sm text-muted-foreground"
          >
            <div>
              <div className="text-3xl font-bold text-foreground tabular-nums mb-1">10K+</div>
              <div className="uppercase tracking-wider">Matchs analysés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground tabular-nums mb-1">500+</div>
              <div className="uppercase tracking-wider">Clubs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground tabular-nums mb-1">98%</div>
              <div className="uppercase tracking-wider">Précision</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
