# Atlas Landing Page Redesign

## Overview
Complete redesign from "startup SaaS" aesthetic to **professional football analytics platform** trusted by clubs and analysts.

## Design Philosophy

### Core Principles
- **Typography as main design tool** - Strong editorial headlines, generous whitespace
- **Football-native visuals only** - SVG pitch grids, heatmaps, pass networks, data charts (NO photos)
- **Calm, confident animations** - Slow timing (0.8-2s), no bounce, respects reduced motion
- **Data > decoration** - Analytical emphasis, minimal marketing language
- **Asymmetrical editorial layouts** - Magazine-style composition

### Design References
- driblab.com (data visualization, analytical credibility)
- altiuslabs.xyz (editorial typography, professional trust)

## Technical Implementation

### New Animation System
**File**: `src/animations/analyticalVariants.ts`
- Custom easing: `[0.25, 0.1, 0.25, 1]` (no bounce/overshoot)
- Durations: 0.8-2 seconds (slow, confident)
- Variants:
  - `sectionVariants`: fade + subtle translate
  - `textRevealVariants`: fade only for headlines
  - `lineDrawVariants`: SVG stroke animations
  - `dataPointVariants`: scale appearance for data viz
  - `hoverScale/hoverBorder`: minimal interactions
- Fully accessible: respects `prefers-reduced-motion`

### Design Primitives

**Colors** (`src/styles/colors.ts`):
- Semantic color system mapped to existing theme tokens
- Surface: base, elevated, subtle
- Text: primary (90%), secondary (70%), tertiary (50%)
- Data: accent (primary), positive (green), negative (red)
- Opacity: pitch (0.08), borders, text states

**Spacing** (`src/styles/spacing.ts`):
- Editorial section padding: `py-32 md:py-40 lg:py-48`
- Container sizes: narrow (3xl), medium (5xl), wide (7xl)
- Asymmetrical grid: 5-column (2 text + 3 visual)
- Balanced grid: 2-column even split
- Features grid: 3-column

### New SVG Components

All located in `src/components/landing/`:

1. **PitchGrid.tsx** - Tactical pitch background
   - Pitch outline, halfway line, center circle
   - Tactical zones: thirds, half-spaces
   - Penalty areas
   - Low opacity (0.08) for background use
   - Optional line drawing animation

2. **HeatmapBlock.tsx** - Intensity visualization
   - Gradient-based zones (x, y, intensity, size)
   - Radial gradients with primary color
   - Background grid pattern
   - Label: "Zone d'intensité"
   - Progressive reveal animation

3. **NodeGraph.tsx** - Pass network diagram
   - SVG nodes + connection lines
   - Node size = importance
   - Connection strength = opacity/width
   - Default: 6 nodes (1, 6, 8, 10, 7, 9), 7 connections
   - Label: "Réseau de passes"
   - Animated entrance

4. **DataVisual.tsx** - Analytical charts
   - Bar chart: horizontal bars with labels/values
   - Line chart: polyline with data points
   - Default data: Possession, Passes, Duels, Pressing, Transitions
   - Progressive reveal on scroll
   - Grid lines for context
   - Title: "Métriques tactiques"

5. **Section.tsx** - Reusable wrappers
   - `Section`: spacing + animation control
   - `SectionHeader`: consistent titles + subtitles
   - `SectionSeparator`: pitch-line inspired divider (gradient line)

### Redesigned Components

**Hero.tsx**:
- **REMOVED**: 3D parallax, Badge, 2-button CTAs, centered layout
- **NEW**:
  - Background: PitchGrid with tactical zones (animated)
  - Headline: "L'intelligence tactique du football, réinventée"
    - Font: 5xl → 7xl → 8xl responsive
    - "réinventée" in primary color
    - Tight tracking, 0.95 leading
  - Subtitle: Single powerful sentence about data transformation
  - Single CTA: "Découvrir Atlas" button with ArrowRight
  - Minimal stats: 10K+ matchs, 500+ clubs, 98% précision
  - Scroll indicator: vertical line with "Défiler" label
  - Vignette: bottom gradient fade

**Landing.tsx** (complete refactor):
- **REMOVED**: ThreeDShowcase, FeatureCard grid, FinalCTA, generic sections
- **NEW STRUCTURE**:
  1. Hero (editorial, minimal)
  2. Capabilities section (asymmetrical text + HeatmapBlock)
  3. SectionSeparator
  4. Data section (NodeGraph + text, reversed asymmetry)
  5. SectionSeparator
  6. Metrics section (2-column DataVisual grid)
  7. SectionSeparator
  8. Features grid (3 cards: BarChart3, Network, Zap icons)
  9. Final CTA (minimal, single button, no card)
  10. Footer (institutional, text-only, 4-column links)

## Content Strategy

### Tone of Voice
- **Analytical**: Precise, data-driven language
- **Confident**: Authoritative without arrogance
- **Minimal**: No marketing fluff or inflated claims
- **French**: Professional French for European market

### Messaging Hierarchy
1. **Primary**: Tactical intelligence transformed by AI
2. **Secondary**: Data that drives decisions
3. **Proof**: Concrete metrics (10K+ matches analyzed)
4. **Trust**: Used by clubs/analysts (implied)

## Removed Components

These files are **not used** in the new design (can be deleted):
- `src/components/landing/ThreeDShowcase.tsx` - 3D parallax showcase
- `src/components/landing/FeatureCard.tsx` - Generic icon cards
- `src/components/landing/FinalCTA.tsx` - Gradient CTA section
- `src/animations/landingVariants.ts` - Old bouncy animations (if exists)

## Responsive Behavior

### Desktop (1024px+)
- Full editorial spacing (py-48)
- Asymmetrical grids: 2 text + 3 visual columns
- Generous typography scale (7xl-8xl headlines)
- All SVG animations enabled

### Tablet (768px-1023px)
- Medium spacing (py-40)
- Grids stack vertically with order control
- Typography: 5xl-6xl headlines
- Animations slightly faster

### Mobile (<768px)
- Compact spacing (py-32)
- Single column, natural order
- Typography: 4xl-5xl headlines
- Simplified animations

## Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Animations**: Graceful degradation with `prefers-reduced-motion`
- **SVG**: Full support (no fallbacks needed for target audience)
- **Framer Motion**: React 18+ required

## Performance Considerations

- **No images**: All visuals are SVG (instant load)
- **Code splitting**: Components lazy-loadable if needed
- **Animation performance**: CSS transforms only (GPU-accelerated)
- **Bundle size**: ~15KB added (motion system + SVG components)

## Future Enhancements

Potential additions (NOT implemented):
- [ ] Video backgrounds for hero (silent, subtle)
- [ ] Interactive pitch grid (click zones for details)
- [ ] Animated formation transitions
- [ ] Real-time data ticker (live match stats)
- [ ] Case study carousel (club testimonials)
- [ ] 3D data visualizations (advanced charts)

## Development Notes

### Running Locally
```bash
bun install
bun run dev
```

### Verifying Animations
1. Open DevTools
2. Navigate to Rendering panel
3. Enable "Emulate CSS prefers-reduced-motion"
4. Verify animations are disabled

### Testing Responsive
- Chrome DevTools device toolbar
- Test breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop)

## Credits

- Design inspiration: driblab.com, altiuslabs.xyz
- Motion philosophy: Apple.com product pages (calm, confident)
- Typography: Inter (display), DM Sans (body)
- Icons: Lucide React
- Animations: Framer Motion

---

**Last Updated**: 2026
**Status**: ✅ Complete - All components compiled, no TypeScript errors
