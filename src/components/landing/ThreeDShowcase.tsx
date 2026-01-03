/**
 * 3D Showcase Component
 * 
 * Faux-3D pitch visualization with perspective transforms.
 * Reacts to mouse movement for subtle parallax effect.
 * Includes scroll-based parallax for depth.
 * Pure CSS transforms - no three.js required.
 */

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Activity, Eye, TrendingUp, Zap } from 'lucide-react';
import { showcaseVariants, prefersReducedMotion } from '@/animations/landingVariants';
import { useParallax } from '@/hooks/useParallax';
import { responsiveTypography } from '@/styles/typography';

export function ThreeDShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Scroll-based parallax
  const showcaseY = useParallax(40, { range: [0.2, 0.6], inverted: true });

  // Mouse position for 3D parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const scale = useSpring(1, springConfig);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    if (!prefersReducedMotion) scale.set(1.02);
  };

  const handleMouseLeave = () => {
    if (!prefersReducedMotion) {
      mouseX.set(0);
      mouseY.set(0);
      scale.set(1);
    }
  };

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={containerRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={prefersReducedMotion ? {} : showcaseVariants}
          className="max-w-6xl mx-auto"
          style={{ y: showcaseY }}
        >
          {/* Section title */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className={`${responsiveTypography.title} mb-4`}>
              Analyse en profondeur
            </h2>
            <p className={`${responsiveTypography.body} text-muted-foreground max-w-2xl mx-auto`}>
              Visualisez chaque mouvement, chaque décision, chaque opportunité tactique
            </p>
          </div>

          {/* 3D Pitch Visualization */}
          <motion.div
            className="relative"
            style={{
              perspective: prefersReducedMotion ? "none" : "1000px",
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              style={{
                rotateX: prefersReducedMotion ? 0 : rotateX,
                rotateY: prefersReducedMotion ? 0 : rotateY,
                scale: prefersReducedMotion ? 1 : scale,
                transformStyle: "preserve-3d",
              }}
              className="relative"
            >
              {/* Main pitch card */}
              <div className="relative bg-card border border-border rounded-2xl p-8 md:p-12 shadow-2xl">
                {/* Pitch pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:32px_32px]" />
                </div>

                {/* Content */}
                <div className="relative z-10 grid md:grid-cols-2 gap-8">
                  {/* Left side - Pitch visualization */}
                  <div className="space-y-6">
                    <div className="aspect-[3/4] bg-primary/10 rounded-lg border-2 border-primary/30 relative overflow-hidden">
                      {/* Simplified pitch */}
                      <div className="absolute inset-4">
                        {/* Center circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-primary/40 rounded-full" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary/60 rounded-full" />
                        
                        {/* Penalty boxes */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/4 border-2 border-primary/40 border-t-0" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/4 border-2 border-primary/40 border-b-0" />
                        
                        {/* Heatmap dots */}
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-3 h-3 bg-primary rounded-full"
                            style={{
                              left: `${Math.random() * 80 + 10}%`,
                              top: `${Math.random() * 80 + 10}%`,
                              opacity: Math.random() * 0.6 + 0.2,
                            }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.3, 0.7, 0.3],
                            }}
                            transition={{
                              duration: 2 + Math.random() * 2,
                              repeat: Infinity,
                              delay: Math.random() * 2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right side - Stats */}
                  <div className="flex flex-col justify-center space-y-6">
                    <StatCard
                      icon={<Activity className="w-5 h-5" />}
                      label="Analyse temps réel"
                      value="< 5 min"
                      delay={0.2}
                    />
                    <StatCard
                      icon={<Eye className="w-5 h-5" />}
                      label="Points de données"
                      value="10K+"
                      delay={0.4}
                    />
                    <StatCard
                      icon={<TrendingUp className="w-5 h-5" />}
                      label="Précision IA"
                      value="98%"
                      delay={0.6}
                    />
                    <StatCard
                      icon={<Zap className="w-5 h-5" />}
                      label="Insights générés"
                      value="50+"
                      delay={0.8}
                    />
                  </div>
                </div>
              </div>

              {/* Floating elements (depth effect) */}
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ transformStyle: "preserve-3d", translateZ: "50px" }}
              />
              
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                animate={{
                  y: [0, 20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                style={{ transformStyle: "preserve-3d", translateZ: "30px" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}

function StatCard({ icon, label, value, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
    >
      <div className="p-3 bg-primary/10 rounded-lg text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}
