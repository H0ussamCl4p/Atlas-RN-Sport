/**
 * Hero Section Component
 * 
 * Full viewport hero with staggered text animations and premium CTAs.
 * Includes subtle 3D parallax effect on mouse movement and scroll-based parallax.
 * Features animated football pitch lines in the background.
 */

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  heroContainerVariants, 
  heroTextVariants, 
  heroButtonVariants,
  badgeVariants,
  prefersReducedMotion 
} from '@/animations/landingVariants';
import { useParallax } from '@/hooks/useParallax';
import { PitchLines } from './PitchLines';
import { responsiveTypography } from '@/styles/typography';

export function Hero() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Scroll-based parallax for background
  const backgroundY = useParallax(30, { range: [0, 0.5] });

  // Mouse position for 3D parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for 3D parallax
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

  useEffect(() => {
    setMounted(true);

    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5);
      const y = (e.clientY / innerHeight - 0.5);
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated pitch lines background with scroll parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <PitchLines variant="hero" animate={true} />
      </motion.div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-50" />

      <motion.div
        variants={prefersReducedMotion ? {} : heroContainerVariants}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        className="relative z-10 container mx-auto px-4 py-20 md:py-32"
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            variants={prefersReducedMotion ? {} : badgeVariants}
            className="flex justify-center"
          >
            <Badge 
              variant="outline" 
              className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5"
            >
              Propulsé par l'IA
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={prefersReducedMotion ? {} : heroTextVariants}
            className={responsiveTypography.hero}
          >
            Atlas
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={prefersReducedMotion ? {} : heroTextVariants}
            className={`${responsiveTypography.title} text-muted-foreground leading-tight`}
          >
            L'intelligence tactique du football,
            <br />
            <span className="text-foreground">réinventée par l'IA</span>
          </motion.p>

          {/* Supporting text */}
          <motion.p
            variants={prefersReducedMotion ? {} : heroTextVariants}
            className={`${responsiveTypography.body} text-muted-foreground max-w-3xl mx-auto leading-relaxed`}
          >
            Transformez vos matchs en décisions tactiques exploitables. 
            Analyse vidéo automatisée, heatmaps en temps réel, et insights de niveau professionnel.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={prefersReducedMotion ? {} : heroTextVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <motion.div
              variants={prefersReducedMotion ? {} : heroButtonVariants}
              whileHover={prefersReducedMotion ? {} : "hover"}
              whileTap={prefersReducedMotion ? {} : "tap"}
            >
              <Button
                size="lg"
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 font-semibold min-h-[44px] touch-manipulation"
                onClick={() => navigate('/register')}
              >
                Commencer l'analyse
              </Button>
            </motion.div>

            <motion.div
              variants={prefersReducedMotion ? {} : heroButtonVariants}
              whileHover={prefersReducedMotion ? {} : "hover"}
              whileTap={prefersReducedMotion ? {} : "tap"}
            >
              <Button
                size="lg"
                variant="outline"
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 font-semibold min-h-[44px] touch-manipulation"
                onClick={() => navigate('/login')}
              >
                Voir la démo
              </Button>
            </motion.div>
          </motion.div>

          {/* Social proof / stats */}
          <motion.div
            variants={prefersReducedMotion ? {} : heroTextVariants}
            className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">10K+</span>
              <span>Matchs analysés</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">500+</span>
              <span>Clubs utilisateurs</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-foreground">98%</span>
              <span>Précision IA</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}
