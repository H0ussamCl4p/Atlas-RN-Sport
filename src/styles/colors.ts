/**
 * Analytical Color System
 * 
 * Professional football analytics color palette.
 * Uses existing theme tokens - no hard-coded values.
 * 
 * PHILOSOPHY:
 * - Dark background (near-black)
 * - Off-white text
 * - One accent (grass green)
 * - Subtle greys for structure
 * - Color for data emphasis only
 */

/**
 * Semantic color usage
 * Maps design intent to theme tokens
 */
export const colors = {
  // Backgrounds
  surface: {
    base: 'bg-background',
    elevated: 'bg-card',
    subtle: 'bg-muted/30',
  },

  // Text hierarchy
  text: {
    primary: 'text-foreground',
    secondary: 'text-muted-foreground',
    tertiary: 'text-muted-foreground/60',
    accent: 'text-primary',
  },

  // Borders & structure
  border: {
    default: 'border-border',
    subtle: 'border-border/50',
    emphasis: 'border-primary/30',
  },

  // Data emphasis
  data: {
    accent: 'text-primary',
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  },

  // Interactive states
  interactive: {
    hover: 'hover:border-primary/50',
    active: 'border-primary',
    focus: 'ring-primary',
  },
} as const;

/**
 * Opacity levels for layering
 */
export const opacity = {
  background: {
    pitch: 'opacity-[0.08]',
    grid: 'opacity-[0.12]',
    separator: 'opacity-[0.15]',
  },
  text: {
    disabled: 'opacity-40',
    secondary: 'opacity-70',
    tertiary: 'opacity-50',
  },
  data: {
    inactive: 'opacity-30',
    active: 'opacity-100',
  },
} as const;
