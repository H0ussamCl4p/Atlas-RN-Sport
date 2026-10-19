/**
 * Pitch Grid Component
 * 
 * SVG-based football pitch grid for backgrounds.
 * Shows zones, thirds, half-spaces - analytical view.
 * Low opacity, background-level visual language.
 */

import { motion } from 'framer-motion';
import { lineDrawVariants, prefersReducedMotion } from '@/animations/analyticalVariants';
import { opacity } from '@/styles/colors';

interface PitchGridProps {
  className?: string;
  animate?: boolean;
  showZones?: boolean;
}

export function PitchGrid({ 
  className = '', 
  animate = false,
  showZones = true 
}: PitchGridProps) {
  const baseOpacity = 0.08;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Pitch outline */}
        <motion.rect
          x="100"
          y="50"
          width="800"
          height="500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
          custom={0}
          initial={animate && !prefersReducedMotion ? "hidden" : false}
          animate={animate && !prefersReducedMotion ? "visible" : false}
          variants={animate && !prefersReducedMotion ? lineDrawVariants : undefined}
          style={!animate ? { opacity: baseOpacity } : undefined}
        />

        {/* Halfway line */}
        <motion.line
          x1="500"
          y1="50"
          x2="500"
          y2="550"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
          custom={1}
          initial={animate && !prefersReducedMotion ? "hidden" : false}
          animate={animate && !prefersReducedMotion ? "visible" : false}
          variants={animate && !prefersReducedMotion ? lineDrawVariants : undefined}
          style={!animate ? { opacity: baseOpacity } : undefined}
        />

        {/* Center circle */}
        <motion.circle
          cx="500"
          cy="300"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
          custom={2}
          initial={animate && !prefersReducedMotion ? "hidden" : false}
          animate={animate && !prefersReducedMotion ? "visible" : false}
          variants={animate && !prefersReducedMotion ? lineDrawVariants : undefined}
          style={!animate ? { opacity: baseOpacity } : undefined}
        />

        {showZones && (
          <>
            {/* Thirds - vertical divisions */}
            <motion.line
              x1="333"
              y1="50"
              x2="333"
              y2="550"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="4 4"
              className="text-primary"
              custom={3}
              initial={animate && !prefersReducedMotion ? "hidden" : false}
              animate={animate && !prefersReducedMotion ? "visible" : false}
              variants={animate && !prefersReducedMotion ? lineDrawVariants : undefined}
              style={!animate ? { opacity: baseOpacity * 0.6 } : undefined}
            />
            <motion.line
              x1="667"
              y1="50"
              x2="667"
              y2="550"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="4 4"
              className="text-primary"
              custom={4}
              initial={animate && !prefersReducedMotion ? "hidden" : false}
              animate={animate && !prefersReducedMotion ? "visible" : false}
              variants={animate && !prefersReducedMotion ? lineDrawVariants : undefined}
              style={!animate ? { opacity: baseOpacity * 0.6 } : undefined}
            />

            {/* Half-spaces - horizontal zones */}
            <motion.line
              x1="100"
              y1="200"
              x2="900"
              y2="200"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="4 4"
              className="text-primary"
              custom={5}
              initial={animate && !prefersReducedMotion ? "hidden" : false}
              animate={animate && !prefersReducedMotion ? "visible" : false}
              variants={animate && !prefersReducedMotion ? lineDrawVariants : undefined}
              style={!animate ? { opacity: baseOpacity * 0.6 } : undefined}
            />
            <motion.line
              x1="100"
              y1="400"
              x2="900"
              y2="400"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="4 4"
              className="text-primary"
              custom={6}
              initial={animate && !prefersReducedMotion ? "hidden" : false}
              animate={animate && !prefersReducedMotion ? "visible" : false}
              variants={animate && !prefersReducedMotion ? lineDrawVariants : undefined}
              style={!animate ? { opacity: baseOpacity * 0.6 } : undefined}
            />
          </>
        )}

        {/* Penalty areas - simplified */}
        <motion.rect
          x="300"
          y="50"
          width="400"
          height="100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
          custom={7}
          initial={animate && !prefersReducedMotion ? "hidden" : false}
          animate={animate && !prefersReducedMotion ? "visible" : false}
          variants={animate && !prefersReducedMotion ? lineDrawVariants : undefined}
          style={!animate ? { opacity: baseOpacity } : undefined}
        />
        <motion.rect
          x="300"
          y="450"
          width="400"
          height="100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary"
          custom={8}
          initial={animate && !prefersReducedMotion ? "hidden" : false}
          animate={animate && !prefersReducedMotion ? "visible" : false}
          variants={animate && !prefersReducedMotion ? lineDrawVariants : undefined}
          style={!animate ? { opacity: baseOpacity } : undefined}
        />
      </svg>
    </div>
  );
}
