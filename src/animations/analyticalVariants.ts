/**
 * Analytical Motion Variants
 * 
 * Calm, confident animations for professional football analytics platform.
 * Inspired by analyst desks and data visualization tools.
 * 
 * PRINCIPLES:
 * - Slow, deliberate timing
 * - Fade + slight translate only
 * - No bounce, no overshoot
 * - Respects prefers-reduced-motion
 * - SVG stroke animations for data drawing
 */

import { Variants, Transition } from 'framer-motion';

// Check for reduced motion preference
export const prefersReducedMotion = 
  typeof window !== 'undefined' && 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Standard easing for analytical UI
 * Calm, confident - not bouncy
 */
const analyticalEasing = [0.25, 0.1, 0.25, 1] as const;

/**
 * Base transition config
 */
const baseTransition: Transition = {
  duration: 0.8,
  ease: analyticalEasing,
};

/**
 * Section entrance - fade + subtle translate
 * For main content blocks
 */
export const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...baseTransition,
      duration: 1,
    },
  },
};

/**
 * Text reveal - fade only, no movement
 * For headlines and important text
 */
export const textRevealVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: analyticalEasing,
    },
  },
};

/**
 * Staggered text - for multi-line headlines
 */
export const staggerTextVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const staggerTextChild: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: analyticalEasing,
    },
  },
};

/**
 * SVG line drawing animation
 * For pitch lines, data connections, charts
 */
export const lineDrawVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: (custom: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 2,
        delay: custom * 0.15,
        ease: analyticalEasing,
      },
      opacity: {
        duration: 0.4,
        delay: custom * 0.15,
      },
    },
  }),
};

/**
 * Data point appearance
 * For nodes, dots, player positions
 */
export const dataPointVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: (custom: number = 0) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: analyticalEasing,
    },
  }),
};

/**
 * Number counter animation
 * For stats and metrics
 */
export const numberCountVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: analyticalEasing,
    },
  },
};

/**
 * Card/panel entrance
 * For data cards and insight blocks
 */
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      ...baseTransition,
      delay: custom * 0.12,
    },
  }),
};

/**
 * Hover state for interactive elements
 * Minimal, purposeful
 */
export const hoverScale = {
  scale: 1.02,
  transition: {
    duration: 0.3,
    ease: analyticalEasing,
  },
};

export const hoverBorder = {
  borderColor: 'hsl(var(--primary))',
  transition: {
    duration: 0.3,
    ease: analyticalEasing,
  },
};

/**
 * Container for staggered children
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Heatmap fade-in
 * For gradient-based visualizations
 */
export const heatmapVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: analyticalEasing,
    },
  },
};

/**
 * Separator line draw
 * For section dividers using pitch lines
 */
export const separatorVariants: Variants = {
  hidden: {
    scaleX: 0,
    opacity: 0,
  },
  visible: {
    scaleX: 1,
    opacity: 0.15,
    transition: {
      duration: 1.2,
      ease: analyticalEasing,
    },
  },
};

/**
 * Progressive data reveal
 * For charts and graphs appearing section by section
 */
export const dataRevealVariants: Variants = {
  hidden: {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0 0 0 0)',
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: analyticalEasing,
    },
  },
};

/**
 * Viewport intersection options
 * For scroll-triggered animations
 */
export const analyticalViewport = {
  once: true,
  margin: '-100px',
  amount: 0.2,
} as const;
