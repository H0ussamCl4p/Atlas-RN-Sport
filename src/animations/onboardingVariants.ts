/**
 * Framer Motion Animation Variants for Onboarding Flow
 * 
 * Design Philosophy:
 * - Subtle, fast, purposeful
 * - Enhances UX without distraction
 * - Premium SaaS feel
 * - Respects accessibility
 */

import { Variants } from "framer-motion";

/**
 * Easing curves for consistent feel
 */
export const ease = {
  smooth: [0.25, 0.1, 0.25, 1],
  snappy: [0.4, 0, 0.2, 1],
} as const;

/**
 * Role Selection Widget - Full overlay entrance
 */
export const overlayVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: ease.smooth,
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: ease.snappy,
    }
  }
};

/**
 * Role card entrance stagger
 */
export const roleCardContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    }
  }
};

/**
 * Individual role card animation
 */
export const roleCardVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: ease.smooth,
    }
  }
};

/**
 * Role card hover state
 */
export const roleCardHoverVariants = {
  rest: { 
    scale: 1,
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    transition: {
      duration: 0.2,
      ease: ease.snappy,
    }
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: 0.1,
    }
  }
};

/**
 * Selected role checkmark
 */
export const checkmarkVariants: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0,
  },
  visible: { 
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    }
  }
};

/**
 * Profile Modal entrance
 */
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: ease.smooth,
      staggerChildren: 0.06,
      delayChildren: 0.1,
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.2,
      ease: ease.snappy,
    }
  }
};

/**
 * Form field stagger animation
 */
export const fieldVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -10,
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: ease.smooth,
    }
  }
};

/**
 * Button loading state
 */
export const buttonLoadingVariants: Variants = {
  idle: { scale: 1 },
  loading: {
    scale: [1, 0.98, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    }
  }
};

/**
 * Success checkmark animation
 */
export const successVariants: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0,
  },
  visible: { 
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.1,
    }
  }
};

/**
 * Backdrop fade
 */
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.2,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2,
    }
  }
};

/**
 * Header text stagger
 */
export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: ease.smooth,
    }
  }
};
