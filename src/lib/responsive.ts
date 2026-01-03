/**
 * Responsive Design System for Atlas
 * 
 * Philosophy:
 * - Mobile-first approach
 * - Fluid layouts over fixed widths
 * - Content reflow, not just scaling
 * - Preserve hierarchy at every breakpoint
 */

// ============================================
// BREAKPOINTS (Tailwind defaults + custom)
// ============================================

export const breakpoints = {
  // Mobile
  xs: '320px',   // Small phones (iPhone SE)
  sm: '640px',   // Large phones (iPhone Pro)
  
  // Tablet
  md: '768px',   // Tablet portrait (iPad)
  lg: '1024px',  // Tablet landscape / Small laptop
  
  // Desktop
  xl: '1280px',  // Desktop
  '2xl': '1536px', // Large desktop
  
  // Ultra-wide
  '3xl': '1920px', // Full HD
  '4xl': '2560px', // 2K/4K
} as const;

// ============================================
// CONTAINER MAX WIDTHS
// ============================================

export const containerMaxWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
} as const;

// ============================================
// SPACING SCALE (rem based for accessibility)
// ============================================

export const spacing = {
  // Micro spacing
  '0.5': '0.125rem',  // 2px
  '1': '0.25rem',     // 4px
  '1.5': '0.375rem',  // 6px
  '2': '0.5rem',      // 8px
  '2.5': '0.625rem',  // 10px
  '3': '0.75rem',     // 12px
  '3.5': '0.875rem',  // 14px
  '4': '1rem',        // 16px
  '5': '1.25rem',     // 20px
  '6': '1.5rem',      // 24px
  '7': '1.75rem',     // 28px
  '8': '2rem',        // 32px
  
  // Macro spacing
  '10': '2.5rem',     // 40px
  '12': '3rem',       // 48px
  '16': '4rem',       // 64px
  '20': '5rem',       // 80px
  '24': '6rem',       // 96px
  '32': '8rem',       // 128px
  '40': '10rem',      // 160px
  '48': '12rem',      // 192px
} as const;

// ============================================
// RESPONSIVE SPACING UTILITIES
// ============================================

export const responsivePadding = {
  page: 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16',
  section: 'py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32',
  container: 'px-4 md:px-6 lg:px-8',
  card: 'p-4 sm:p-6 lg:p-8',
  tight: 'px-2 sm:px-3 md:px-4',
} as const;

export const responsiveGap = {
  xs: 'gap-2 sm:gap-3',
  sm: 'gap-3 sm:gap-4 md:gap-6',
  md: 'gap-4 sm:gap-6 lg:gap-8',
  lg: 'gap-6 sm:gap-8 lg:gap-10 xl:gap-12',
  xl: 'gap-8 sm:gap-10 lg:gap-12 xl:gap-16',
} as const;

// ============================================
// GRID SYSTEMS
// ============================================

export const gridLayouts = {
  // Stat cards
  stats: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  statsCompact: 'grid grid-cols-2 md:grid-cols-4',
  
  // Feature cards
  features: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  featuresWide: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  
  // Content layouts
  sidebar: 'grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px]',
  mainContent: 'grid grid-cols-1 lg:grid-cols-3',
  twoColumn: 'grid grid-cols-1 md:grid-cols-2',
  threeColumn: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  fourColumn: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  
  // Dashboard specific
  dashboardMain: 'grid grid-cols-1 lg:grid-cols-[2fr_1fr]',
  dashboardBottom: 'grid grid-cols-1 xl:grid-cols-2',
} as const;

// ============================================
// RESPONSIVE TYPOGRAPHY
// ============================================

export const responsiveText = {
  // Display (Hero/Landing)
  displayXl: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
  displayLg: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
  displayMd: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  
  // Headings
  h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
  h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
  h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
  h4: 'text-base sm:text-lg md:text-xl lg:text-2xl',
  h5: 'text-sm sm:text-base md:text-lg lg:text-xl',
  
  // Body
  bodyLg: 'text-base sm:text-lg md:text-xl',
  bodyMd: 'text-sm sm:text-base md:text-lg',
  bodySm: 'text-xs sm:text-sm md:text-base',
  
  // UI
  button: 'text-sm sm:text-base',
  label: 'text-xs sm:text-sm',
  caption: 'text-xs',
} as const;

// ============================================
// RESPONSIVE COMPONENT SIZES
// ============================================

export const componentSizes = {
  // Buttons
  buttonSm: 'h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm',
  buttonMd: 'h-9 px-4 text-sm sm:h-10 sm:px-5 sm:text-base',
  buttonLg: 'h-10 px-5 text-sm sm:h-11 sm:px-6 sm:text-base md:h-12 md:px-8 md:text-lg',
  
  // Icons
  iconSm: 'w-4 h-4 sm:w-5 sm:h-5',
  iconMd: 'w-5 h-5 sm:w-6 sm:h-6',
  iconLg: 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8',
  
  // Inputs
  inputSm: 'h-8 text-sm sm:h-9',
  inputMd: 'h-9 text-sm sm:h-10 sm:text-base',
  inputLg: 'h-10 text-base sm:h-11 md:h-12',
  
  // Cards
  cardSm: 'p-3 sm:p-4',
  cardMd: 'p-4 sm:p-5 md:p-6',
  cardLg: 'p-5 sm:p-6 md:p-8',
} as const;

// ============================================
// SIDEBAR RESPONSIVE BEHAVIOR
// ============================================

export const sidebarConfig = {
  // Widths
  mobile: {
    closed: '0',
    open: '100vw',
  },
  tablet: {
    collapsed: '4rem',  // 64px
    expanded: '16rem',  // 256px
  },
  desktop: {
    collapsed: '4rem',
    expanded: '16rem',
  },
  
  // Breakpoint behavior
  behavior: {
    // < 768px: Hidden by default, drawer overlay when open
    mobile: 'drawer-overlay',
    // 768px - 1024px: Collapsible sidebar
    tablet: 'collapsible',
    // >= 1024px: Full sidebar (collapsible)
    desktop: 'persistent',
  },
} as const;

// ============================================
// LAYOUT SHIFTS
// ============================================

export const layoutShifts = {
  // Main content padding based on sidebar
  mainPadding: {
    mobile: 'pl-0',                    // No sidebar on mobile
    tablet: 'md:pl-16',                // Collapsed sidebar
    tabletExpanded: 'md:pl-64',        // Expanded sidebar
    desktop: 'lg:pl-16',               // Collapsed sidebar
    desktopExpanded: 'lg:pl-64',       // Expanded sidebar
  },
} as const;

// ============================================
// RESPONSIVE VISIBILITY
// ============================================

export const visibility = {
  mobileOnly: 'block md:hidden',
  tabletUp: 'hidden md:block',
  desktopOnly: 'hidden lg:block',
  notMobile: 'hidden sm:block',
  notDesktop: 'block lg:hidden',
} as const;

// ============================================
// ANIMATION ADJUSTMENTS PER DEVICE
// ============================================

export const responsiveAnimations = {
  // Reduce animation complexity on mobile
  mobile: {
    duration: '200ms',
    disableParallax: true,
    simplifyAnimations: true,
  },
  
  // Full animations on desktop
  desktop: {
    duration: '300ms',
    enableParallax: true,
    fullAnimations: true,
  },
} as const;

// ============================================
// TOUCH TARGET SIZES
// ============================================

export const touchTargets = {
  // Minimum 44x44px for touch devices
  minimum: 'min-h-[44px] min-w-[44px]',
  button: 'min-h-[44px]',
  icon: 'min-h-[44px] min-w-[44px]',
  link: 'min-h-[44px] py-2',
} as const;

// ============================================
// RESPONSIVE UTILITIES
// ============================================

/**
 * Get responsive classes for element
 */
export function getResponsiveClasses(config: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}): string {
  const classes: string[] = [];
  
  if (config.base) classes.push(config.base);
  if (config.sm) classes.push(`sm:${config.sm}`);
  if (config.md) classes.push(`md:${config.md}`);
  if (config.lg) classes.push(`lg:${config.lg}`);
  if (config.xl) classes.push(`xl:${config.xl}`);
  if (config['2xl']) classes.push(`2xl:${config['2xl']}`);
  
  return classes.join(' ');
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 1024;
}

/**
 * Get current breakpoint
 */
export function getCurrentBreakpoint(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  if (typeof window === 'undefined') return 'lg';
  
  const width = window.innerWidth;
  
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  if (width < 1536) return 'xl';
  return '2xl';
}
