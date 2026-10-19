/**
 * Editorial Spacing System
 * 
 * Generous margins and rhythm for analytical, magazine-like layouts.
 * Designed for desktop-first, editorial content.
 */

/**
 * Section spacing - vertical rhythm
 */
export const section = {
  // Full-bleed sections
  padding: {
    desktop: 'py-32 md:py-40 lg:py-48',
    tablet: 'py-24 md:py-32',
    mobile: 'py-16 md:py-24',
  },

  // Inner content max-width
  container: {
    narrow: 'max-w-3xl mx-auto',
    medium: 'max-w-5xl mx-auto',
    wide: 'max-w-7xl mx-auto',
    full: 'mx-auto px-4 md:px-8',
  },

  // Vertical spacing between elements
  gap: {
    tight: 'space-y-8',
    normal: 'space-y-12 md:space-y-16',
    loose: 'space-y-16 md:space-y-24',
    editorial: 'space-y-20 md:space-y-32',
  },
} as const;

/**
 * Typography spacing
 */
export const typography = {
  // Space after headings
  headingMargin: {
    large: 'mb-8 md:mb-12',
    medium: 'mb-6 md:mb-8',
    small: 'mb-4 md:mb-6',
  },

  // Space between paragraphs
  paragraphGap: 'space-y-4 md:space-y-6',

  // Line height (defined in tailwind config, referenced here)
  lineHeight: {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose',
  },
} as const;

/**
 * Grid systems for asymmetrical layouts
 */
export const grid = {
  // Text + Visual split
  asymmetrical: {
    textLeft: 'grid md:grid-cols-5 gap-8 md:gap-16 items-center',
    textRight: 'grid md:grid-cols-5 gap-8 md:gap-16 items-center',
    textSpan: 'md:col-span-2',
    visualSpan: 'md:col-span-3',
  },

  // Even split for balanced content
  balanced: 'grid md:grid-cols-2 gap-8 md:gap-16 items-start',

  // Three-column for features
  features: 'grid md:grid-cols-3 gap-8 md:gap-12',
} as const;

/**
 * Component spacing
 */
export const component = {
  // Card padding
  card: {
    compact: 'p-6 md:p-8',
    comfortable: 'p-8 md:p-12',
    spacious: 'p-12 md:p-16',
  },

  // Button spacing
  button: {
    gap: 'space-x-4',
    padding: 'px-8 py-4',
  },

  // List spacing
  list: {
    tight: 'space-y-2',
    normal: 'space-y-4',
    loose: 'space-y-6',
  },
} as const;

/**
 * Editorial margins
 * Large, confident spacing
 */
export const editorial = {
  // Horizontal margins for text blocks
  margin: {
    text: 'mx-auto max-w-2xl',
    heading: 'mx-auto max-w-4xl',
  },

  // Section separators
  separator: {
    margin: 'my-24 md:my-32',
    height: 'h-px',
  },
} as const;
