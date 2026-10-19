/**
 * Heatmap Block Component
 * 
 * Analytical heatmap visualization using gradient overlays.
 * Represents player intensity, zone coverage, pressing areas.
 * No photos - pure data visualization.
 */

import { motion } from 'framer-motion';
import { heatmapVariants, prefersReducedMotion } from '@/animations/analyticalVariants';

interface HeatmapBlockProps {
  zones?: Array<{
    x: number; // 0-100
    y: number; // 0-100
    intensity: number; // 0-1
    size: number; // radius
  }>;
  className?: string;
}

const defaultZones = [
  { x: 30, y: 40, intensity: 0.8, size: 80 },
  { x: 50, y: 25, intensity: 0.6, size: 60 },
  { x: 70, y: 50, intensity: 0.9, size: 70 },
  { x: 40, y: 70, intensity: 0.5, size: 50 },
];

export function HeatmapBlock({ 
  zones = defaultZones,
  className = '' 
}: HeatmapBlockProps) {
  return (
    <motion.div
      className={`relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-border/50 ${className}`}
      initial={!prefersReducedMotion ? "hidden" : undefined}
      whileInView={!prefersReducedMotion ? "visible" : undefined}
      viewport={{ once: true, margin: '-100px' }}
      variants={!prefersReducedMotion ? heatmapVariants : undefined}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[#F6F9F7] bg-[linear-gradient(to_right,#0B3D2E0D_1px,transparent_1px),linear-gradient(to_bottom,#0B3D2E0D_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Pitch outline subtle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[90%] h-[85%] border border-primary/20 rounded-sm" />
      </div>

      {/* Heatmap zones */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {zones.map((zone, i) => (
            <radialGradient
              key={`gradient-${i}`}
              id={`heat-${i}`}
              cx="50%"
              cy="50%"
            >
              <stop 
                offset="0%" 
                stopColor="hsl(var(--primary))" 
                stopOpacity={zone.intensity * 0.6} 
              />
              <stop 
                offset="50%" 
                stopColor="hsl(var(--primary))" 
                stopOpacity={zone.intensity * 0.3} 
              />
              <stop 
                offset="100%" 
                stopColor="hsl(var(--primary))" 
                stopOpacity="0" 
              />
            </radialGradient>
          ))}
        </defs>

        {zones.map((zone, i) => (
          <motion.circle
            key={i}
            cx={zone.x}
            cy={zone.y}
            r={zone.size / 2}
            fill={`url(#heat-${i})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1,
              delay: i * 0.15,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />
        ))}
      </svg>

      {/* Overlay label */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Zone d'intensité
        </span>
      </div>
    </motion.div>
  );
}
