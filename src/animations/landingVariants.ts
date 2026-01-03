/**
 * Landing Page Animation Variants
 * 
 * Philosophy: Subtle, purposeful animations that enhance UX without distraction.
 * All animations respect prefers-reduced-motion for accessibility.
 */

import { Variants, Easing } from 'framer-motion';

// Detect if user prefers reduced motion
export const prefersReducedMotion = 
  typeof window !== 'undefined' && 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Easing curves for premium feel
const easing = {
  smooth: [0.25, 0.1, 0.25, 1] as Easing,
  snappy: [0.4, 0, 0.2, 1] as Easing,
  bounce: [0.68, -0.55, 0.265, 1.55] as Easing,
};

// Hero Section Animations
export const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const heroTextVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
};

export const heroButtonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easing.smooth,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: easing.snappy,
    },
  },
  tap: {
    scale: 0.98,
  },
};

// 3D Showcase Animations
export const showcaseVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: easing.smooth,
    },
  },
};

// Feature Card Animations (scroll-triggered)
export const featureCardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easing.smooth,
    },
  },
};

export const featureContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Icon Animation (hover on feature cards)
export const iconHoverVariants: Variants = {
  rest: { 
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.3,
      ease: easing.snappy,
    },
  },
};

// Value Proposition Section
export const valuePropVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easing.smooth,
    },
  },
};

// Steps Animation (How It Works)
export const stepVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20,
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.2,
      ease: easing.smooth,
    },
  }),
};

// Final CTA Section
export const ctaCardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
};

// Floating animation for 3D elements
export const floatingVariants: Variants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Parallax effect for mouse movement
export const parallaxVariants = {
  initial: {
    x: 0,
    y: 0,
  },
};

// Badge/Pill animation (for "New", "AI", etc.)
export const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
};
