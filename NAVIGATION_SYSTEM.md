# Atlas Navigation System

## Overview
Calm, institutional navigation system for the Atlas landing page. Designed to feel like an elite football analytics publication, not a startup SaaS.

## Design Philosophy

### Core Principles
- **Minimal & editorial** - Publication-like aesthetic
- **Transparent by default** - Background fades in on scroll
- **Typography-first** - No logo images, text wordmark only
- **Calm interactions** - Slow, confident animations
- **Accessibility-first** - Keyboard nav, focus states, touch targets ≥44px

### Visual Language
- No shadows
- No rounded pills
- No gradients
- Accent color only for hover/active states
- Underline animations for links
- Subtle bottom border divider

## Components

### 1. LandingNavbar
**File**: `src/components/landing/LandingNavbar.tsx`

**Layout**:
- Left: "Atlas" wordmark (text only)
- Right: Navigation items + CTA

**Navigation Items**:
1. **Produit** - Scrolls to `#features` section
2. **Méthodologie** - Scrolls to `#methodology` section
3. **Connexion** - Routes to `/login`
4. **Créer un compte** - Primary CTA, routes to `/register`

**Behavior**:
- Fixed position (sticky)
- Transparent by default
- Background: `bg-background/80 backdrop-blur-md` appears after 100px scroll
- Border: `border-b border-border/50` appears on scroll
- Smooth scroll to sections using `scrollIntoView({ behavior: 'smooth' })`

**Desktop** (md+):
- Horizontal layout
- Items with underline hover animation (border expansion)
- Primary CTA button on right

**Mobile** (<md):
- Hamburger menu toggle (Menu/X icons)
- Full-screen overlay with backdrop blur
- Stacked vertical menu
- Animation: slide up + fade in
- Each item animates in with stagger delay

**Animations**:
- Navbar: fade + translate from top (1s duration)
- Mobile menu: fade backdrop + slide up content
- Menu items: stagger entrance (0.1s delay each)
- All respect `prefers-reduced-motion`

**Accessibility**:
- Focus rings on all interactive elements
- `aria-label` on menu toggle
- Keyboard navigation works
- Touch targets ≥44px on mobile

---

### 2. ScrollIndicator
**File**: `src/components/landing/ScrollIndicator.tsx`

**Design**:
- Positioned: bottom center of viewport
- Label: "Défiler" (uppercase, tight tracking)
- Icon: ChevronDown (lucide-react)
- Style: Low opacity (`text-muted-foreground/50`)

**Behavior**:
- Appears on hero section only
- Disappears after scrolling 400px
- Click → smooth scroll to `targetSectionId` (default: `#features`)
- Gentle vertical animation: `y: [0, 8, 0]` over 2s

**Animation**:
- Initial: fade + translate up delay 2s
- Continuous: subtle bounce (8px)
- Exit: fade + translate up
- Respects `prefers-reduced-motion`

**Props**:
```tsx
interface ScrollIndicatorProps {
  targetSectionId?: string;  // Default: 'features'
  className?: string;
}
```

---

### 3. Section IDs
Added to Landing.tsx for scroll navigation:

| Section | ID | Purpose |
|---------|-------|---------|
| Capabilities | `#features` | Product features |
| Data/Analysis | `#methodology` | Methodology explanation |
| Final CTA | `#cta` | Call to action |

**Implementation**:
```tsx
<Section spacing="desktop" id="features">
  {/* ... */}
</Section>
```

---

### 4. CTA Button Updates

All CTAs now use proper routing:

**Hero CTA**:
```tsx
<button onClick={() => navigate('/register')}>
  Découvrir Atlas
</button>
```

**Final CTA Section**:
```tsx
<button onClick={() => navigate('/register')}>
  Commencer avec Atlas
</button>
<button onClick={() => navigate('/login')}>
  Se connecter
</button>
```

**Focus States**:
All buttons have:
```css
focus:outline-none 
focus:ring-2 
focus:ring-primary 
focus:ring-offset-2 
focus:ring-offset-background
```

---

## Technical Implementation

### Scroll Detection
```tsx
const { scrollY } = useScroll();
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  return scrollY.on('change', (latest) => {
    setIsScrolled(latest > 100);
  });
}, [scrollY]);
```

### Smooth Scroll to Section
```tsx
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
};
```

### Mobile Menu State
```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

### React Router Navigation
```tsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();

// Usage
navigate('/register');
navigate('/login');
```

---

## Responsive Behavior

### Desktop (md: 768px+)
- Horizontal navbar layout
- All nav items visible
- Underline hover animations
- Primary CTA button on right

### Tablet (sm-md: 640px-767px)
- Mobile menu collapses
- Hamburger icon appears
- Full-screen overlay menu

### Mobile (<640px)
- Same as tablet
- Larger touch targets (44px min)
- Stacked vertical menu items
- Full-width CTA button

---

## Animation Timing

All animations use calm, analytical timing:

```tsx
// Easing
ease: [0.25, 0.1, 0.25, 1]

// Durations
navbar: 1s
mobile menu backdrop: 0.3s
mobile menu content: 0.4s
menu item stagger: 0.1s delay each
scroll indicator: 2s (bounce), 1s (fade)
```

---

## Color Tokens Used

```css
/* Navbar */
bg-background/80
backdrop-blur-md
border-border/50

/* Text */
text-foreground
text-muted-foreground
text-primary (hover)

/* CTA Button */
bg-primary
text-primary-foreground
hover:bg-primary/90

/* Mobile Menu */
bg-background/95
bg-muted/50 (hover)

/* Scroll Indicator */
text-muted-foreground/50
```

---

## Accessibility Features

✅ **Keyboard Navigation**
- Tab through all nav items
- Enter/Space to activate
- Escape to close mobile menu

✅ **Focus States**
- Visible focus rings on all interactive elements
- 2px primary color ring with offset

✅ **Touch Targets**
- All buttons/links ≥44px on mobile
- Mobile menu items: 44px height

✅ **Screen Readers**
- `aria-label` on menu toggle
- Semantic HTML (nav, button)

✅ **Reduced Motion**
- All animations respect `prefers-reduced-motion`
- Graceful degradation to static state

---

## Integration with Landing Page

### Landing.tsx Structure
```tsx
export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SEO {...} />
      
      {/* Navigation */}
      <LandingNavbar />
      
      {/* Hero */}
      <Hero />
      
      {/* Scroll Indicator */}
      <ScrollIndicator targetSectionId="features" />
      
      {/* Sections with IDs */}
      <Section id="features">...</Section>
      <Section id="methodology">...</Section>
      <Section id="cta">...</Section>
      
      {/* Footer */}
      <footer>...</footer>
    </div>
  );
}
```

---

## File Structure

```
src/
├── components/landing/
│   ├── LandingNavbar.tsx       ← NEW
│   ├── ScrollIndicator.tsx     ← NEW
│   ├── Hero.tsx                ← UPDATED (CTA focus states)
│   └── Section.tsx             ← UPDATED (id prop)
├── pages/
│   └── Landing.tsx             ← UPDATED (navbar, scroll, CTAs)
└── animations/
    └── analyticalVariants.ts   ← USED (motion variants)
```

---

## Testing Checklist

### Desktop
- [ ] Navbar appears with fade animation
- [ ] Background fades in after scroll (100px)
- [ ] Nav items have underline hover animation
- [ ] Click "Produit" → scrolls to features
- [ ] Click "Méthodologie" → scrolls to methodology
- [ ] Click "Connexion" → routes to /login
- [ ] Click "Créer un compte" → routes to /register
- [ ] Scroll indicator animates gently
- [ ] Scroll indicator disappears after 400px

### Mobile
- [ ] Hamburger menu icon visible
- [ ] Click menu → overlay opens with backdrop
- [ ] Menu items animate in with stagger
- [ ] Click nav item → scrolls + closes menu
- [ ] Click CTA → routes + closes menu
- [ ] Touch targets ≥44px
- [ ] No layout shift on scroll

### Keyboard
- [ ] Tab through all nav items
- [ ] Focus rings visible
- [ ] Enter activates links/buttons
- [ ] Escape closes mobile menu

### Accessibility
- [ ] Screen reader announces elements correctly
- [ ] Reduced motion disables animations
- [ ] Color contrast passes WCAG AA

---

## Performance Notes

- **No images**: All SVG icons (lucide-react)
- **Backdrop blur**: GPU-accelerated, performant
- **Scroll listener**: Throttled via Framer Motion `scrollY.on('change')`
- **Animation performance**: CSS transforms only
- **Bundle impact**: ~8KB (LandingNavbar + ScrollIndicator)

---

## Design References

This navigation system is inspired by:
- **driblab.com**: Minimal analytics header
- **altiuslabs.xyz**: Editorial navbar treatment
- **Apple.com**: Calm, confident scroll behavior
- **Medium.com**: Publication-style wordmark

---

**Last Updated**: January 3, 2026  
**Status**: ✅ Complete - All components compiled, no TypeScript errors
