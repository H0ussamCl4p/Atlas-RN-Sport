/**
 * Typography System for Atlas
 * 
 * Font Pairing:
 * - Display/Headings: Inter (geometric, modern, tech-forward)
 * - Body/UI: DM Sans (humanist, readable, warm)
 * 
 * Scale:
 * - Display: 72px → 48px (hero sections)
 * - Headings: 36px → 20px (section titles)
 * - Body: 18px → 14px (content)
 * - UI: 15px → 13px (buttons, labels)
 * 
 * Usage Examples:
 * 
 * Hero:
 * <h1 className="font-display text-display-2xl">
 *   Atlas
 * </h1>
 * 
 * Section Title:
 * <h2 className="font-display text-heading-xl">
 *   Fonctionnalités
 * </h2>
 * 
 * Body Text:
 * <p className="font-body text-body-lg text-muted-foreground">
 *   Atlas transforme les matchs...
 * </p>
 * 
 * Button:
 * <button className="font-body text-ui-md font-medium">
 *   Commencer
 * </button>
 * 
 * Mobile Responsive:
 * <h1 className="font-display text-display-lg md:text-display-xl lg:text-display-2xl">
 *   Responsive Hero
 * </h1>
 */

export const typography = {
  display: {
    '2xl': 'font-display text-display-2xl',
    'xl': 'font-display text-display-xl',
    'lg': 'font-display text-display-lg',
  },
  
  heading: {
    'xl': 'font-display text-heading-xl',
    'lg': 'font-display text-heading-lg',
    'md': 'font-display text-heading-md',
    'sm': 'font-display text-heading-sm',
  },
  
  body: {
    'lg': 'font-body text-body-lg',
    'md': 'font-body text-body-md',
    'sm': 'font-body text-body-sm',
  },
  
  ui: {
    'lg': 'font-body text-ui-lg',
    'md': 'font-body text-ui-md',
    'sm': 'font-body text-ui-sm',
  },
} as const;

/**
 * Responsive Typography Helper
 * 
 * Automatically scales typography for mobile → tablet → desktop
 */
export const responsiveTypography = {
  hero: 'font-display text-display-lg md:text-display-xl lg:text-display-2xl',
  title: 'font-display text-heading-md md:text-heading-lg lg:text-heading-xl',
  subtitle: 'font-display text-heading-sm md:text-heading-md',
  body: 'font-body text-body-sm md:text-body-md lg:text-body-lg',
  caption: 'font-body text-body-sm',
} as const;

/**
 * Color Combinations
 * 
 * Pre-configured text color pairings for consistent hierarchy
 */
export const textColors = {
  primary: 'text-foreground',
  secondary: 'text-muted-foreground',
  tertiary: 'text-muted-foreground/70',
  accent: 'text-primary',
  inverse: 'text-primary-foreground',
} as const;
