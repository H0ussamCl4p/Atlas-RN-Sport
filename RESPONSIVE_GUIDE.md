# Atlas Responsive Design System - Implementation Guide

## 📱 Overview

Atlas now features a comprehensive, mobile-first responsive design system that ensures pixel-perfect layouts across all screen sizes from 320px (iPhone SE) to 2560px (4K displays).

## 🎯 Breakpoints

```typescript
xs:  320px  // iPhone SE, small phones
sm:  640px  // Large phones, portrait tablets
md:  768px  // Tablets, small laptops
lg:  1024px // Laptops, desktops
xl:  1280px // Large desktops
2xl: 1536px // Ultra-wide displays
3xl: 1920px // Full HD+
4xl: 2560px // 4K displays
```

## 🏗️ Architecture

### Design System Location
- **File**: `src/lib/responsive.ts`
- **Exports**: 
  - Breakpoints & container widths
  - Spacing scales (rem-based)
  - Grid layouts (14 presets)
  - Typography scales
  - Component sizes
  - Sidebar configurations
  - Utility functions

### Key Utilities

#### Device Detection
```typescript
import { isMobile, isTablet, isDesktop, getCurrentBreakpoint } from '@/lib/responsive';

// Boolean checks
if (isMobile()) { /* < 768px */ }
if (isTablet()) { /* 768-1024px */ }
if (isDesktop()) { /* >= 1024px */ }

// Get current breakpoint
const bp = getCurrentBreakpoint(); // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

#### Grid Layouts
```typescript
import { gridLayouts } from '@/lib/responsive';

// Pre-configured responsive grids
<div className={gridLayouts.stats}>
  {/* 1 col on mobile, 2 on tablet, 4 on desktop */}
</div>

<div className={gridLayouts.dashboardMain}>
  {/* 1 col on mobile, 3 on desktop */}
</div>
```

#### Responsive Spacing
```typescript
import { responsivePadding, responsiveGap } from '@/lib/responsive';

// Adaptive padding
<section className={responsivePadding.page}>
  {/* Mobile: p-4, Tablet: p-6, Desktop: p-8 */}
</section>

// Adaptive gaps
<div className={responsiveGap.md}>
  {/* Mobile: gap-4, Desktop: gap-6 */}
</div>
```

#### Typography
```typescript
import { responsiveText } from '@/lib/responsive';

<h1 className={responsiveText.displayXl}>
  {/* Mobile: 3rem, Tablet: 4rem, Desktop: 5rem */}
</h1>

<p className={responsiveText.bodyMd}>
  {/* Mobile: 0.875rem, Desktop: 1rem */}
</p>
```

## 📦 Component Implementation

### ✅ Sidebar (`src/components/layout/Sidebar.tsx`)
**Status**: Fully responsive ✓

**Features**:
- **Mobile (<768px)**: Sheet drawer overlay
  - Fixed header with menu button
  - Drawer slides from left (280-320px)
  - Auto-closes on route change
  - 44px minimum touch targets
- **Tablet/Desktop (≥768px)**: Persistent collapsible sidebar
  - Collapsed: 64px (4rem)
  - Expanded: 256px (16rem)
  - Smooth transitions

**Implementation**:
```typescript
// Device detection with resize listener
const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

useEffect(() => {
  const handleResize = () => {
    if (isMobile()) setDeviceType('mobile');
    else if (isTablet()) setDeviceType('tablet');
    else setDeviceType('desktop');
  };
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Conditional rendering
if (deviceType === 'mobile') {
  return <MobileHeaderWithDrawer />;
}
return <PersistentSidebar />;
```

### ✅ MainLayout (`src/components/layout/MainLayout.tsx`)
**Status**: Fully responsive ✓

**Features**:
- Mobile: No left padding (drawer overlay), top padding for header (56px)
- Tablet: Responsive padding based on collapsed sidebar
- Desktop: Full padding for expanded sidebar

**Implementation**:
```typescript
<main className="min-h-screen transition-all duration-300 md:pl-16 lg:pl-64 pt-14 md:pt-0">
  <div className="p-4 sm:p-6 md:p-8">
    {children}
  </div>
</main>
```

### ✅ Dashboard (`src/pages/Dashboard.tsx`)
**Status**: Fully responsive ✓

**Features**:
- Header: Stacks on mobile, horizontal on tablet+
- Button text: Abbreviated on mobile, full on desktop
- Stats grid: 1 col → 2 cols → 4 cols
- Main content: 1 col → 3 cols (2+1 split)
- Bottom row: 1 col → 2 cols
- All touch targets ≥ 44px

**Grid Implementation**:
```typescript
// Stats: 1 → 2 → 4 columns
<div className={`${gridLayouts.stats} ${responsiveGap.md}`}>
  <StatCard ... />
</div>

// Main: 1 → 3 columns (lg:col-span-2 for left column)
<div className={`${gridLayouts.dashboardMain} ${responsiveGap.md}`}>
  <div className="lg:col-span-2">...</div>
  <div>...</div>
</div>

// Bottom: 1 → 2 columns
<div className={`${gridLayouts.dashboardBottom} ${responsiveGap.md}`}>
  ...
</div>
```

### ✅ Landing Page (`src/pages/Landing.tsx`)
**Status**: Fully responsive ✓

**Features**:
- Mobile-optimized section spacing (py-12 → py-32)
- Responsive typography throughout
- Touch-friendly footer links (44px)
- Fluid container widths
- Animations respect `prefers-reduced-motion`

**Spacing Pattern**:
```typescript
<section className="py-12 sm:py-16 md:py-20 lg:py-32">
  {/* Gradual increase from mobile to desktop */}
</section>
```

### ✅ Upload Page (`src/pages/Upload.tsx`)
**Status**: Fully responsive ✓

**Features**:
- Responsive upload zone (p-8 sm:p-12)
- Feature grid: 1 col → 2 cols → 3 cols
- Mobile-friendly text truncation
- Format badges wrap on small screens
- All buttons ≥ 44px height

### ✅ UploadZone Component (`src/components/upload/UploadZone.tsx`)
**Status**: Fully responsive ✓

**Features**:
- Upload area adapts to screen size
- Processing steps with truncation
- Full-width buttons on mobile
- Responsive icon sizes
- Flexible gap spacing

### ✅ StatCard Component (`src/components/dashboard/StatCard.tsx`)
**Status**: Fully responsive ✓

**Features**:
- Responsive text sizes (text-xl → text-3xl)
- Adaptive spacing (mb-3 sm:mb-4)
- Maintains readability at all sizes

## 🎨 Design Principles

### 1. Mobile-First Approach
Always design for mobile first, then enhance for larger screens:
```typescript
// ✅ Good
<div className="p-4 sm:p-6 md:p-8">

// ❌ Bad
<div className="p-8 md:p-6 sm:p-4">
```

### 2. Touch Targets
All interactive elements must be ≥ 44px in height/width:
```typescript
import { touchTargets } from '@/lib/responsive';

<Button className={touchTargets.button}>
  {/* min-h-[44px] w-auto min-w-[44px] */}
</Button>
```

### 3. Fluid Typography
Use responsive text utilities for scalable type:
```typescript
// ✅ Good
<h1 className="text-2xl sm:text-3xl lg:text-4xl">

// Or use design system
<h1 className={responsiveText.displayLg}>
```

### 4. Content Reflow
Content should stack vertically on mobile, spread horizontally on desktop:
```typescript
<div className="flex flex-col sm:flex-row gap-4">
  {/* Vertical on mobile, horizontal on tablet+ */}
</div>
```

### 5. Adaptive Spacing
Use responsive padding/gap utilities:
```typescript
// Section spacing
<section className="py-12 sm:py-16 md:py-20 lg:py-32">

// Grid gaps
<div className="grid gap-4 sm:gap-6 md:gap-8">
```

## 🧪 Testing Checklist

### Screen Sizes to Test
- [ ] **320px** - iPhone SE (portrait)
- [ ] **375px** - iPhone 12/13/14 (portrait)
- [ ] **390px** - iPhone 14 Pro (portrait)
- [ ] **768px** - iPad (portrait)
- [ ] **1024px** - iPad Pro (portrait), small laptop
- [ ] **1280px** - Standard laptop
- [ ] **1440px** - MacBook Pro 14"
- [ ] **1920px** - Full HD desktop
- [ ] **2560px** - 4K display

### Device Testing
- [ ] **Mobile**: Chrome DevTools mobile emulation
- [ ] **Tablet**: iPad, Android tablet
- [ ] **Desktop**: Windows, macOS
- [ ] **Real device**: Test on actual phone

### Component Checklist
- [ ] **Sidebar**: Drawer on mobile, persistent on desktop
- [ ] **Dashboard**: All grids responsive, cards readable
- [ ] **Landing**: No horizontal overflow, smooth scrolling
- [ ] **Upload**: Drop zone usable on all sizes
- [ ] **Forms**: Inputs properly sized, buttons accessible
- [ ] **Navigation**: Touch targets ≥ 44px
- [ ] **Typography**: Readable at all sizes

### Interaction Testing
- [ ] Touch gestures work on mobile (tap, swipe, scroll)
- [ ] Hover states only on hover-capable devices
- [ ] Keyboard navigation functional on all sizes
- [ ] Form inputs trigger mobile keyboard correctly
- [ ] Buttons respond to touch without delay
- [ ] Drawer auto-closes on navigation (mobile)
- [ ] Sidebar collapse works smoothly (desktop)

### Performance Testing
- [ ] No layout shifts during load
- [ ] Smooth transitions/animations
- [ ] Images load progressively
- [ ] No horizontal scrollbar at any size
- [ ] Text doesn't overflow containers
- [ ] Animations respect `prefers-reduced-motion`

### Accessibility Testing
- [ ] Zoom to 200% without breaking layout
- [ ] Screen reader announces drawer state
- [ ] Focus visible on all interactive elements
- [ ] Color contrast sufficient at all sizes
- [ ] Touch targets don't overlap

## 🔧 Debugging Tips

### Check Current Breakpoint
```typescript
// In browser console
window.innerWidth // Get viewport width
getCurrentBreakpoint() // Get breakpoint name
```

### Tailwind Responsive Indicators
Add this to see current breakpoint during development:
```typescript
<div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
  <span className="block xs:hidden">XS</span>
  <span className="hidden xs:block sm:hidden">SM</span>
  <span className="hidden sm:block md:hidden">MD</span>
  <span className="hidden md:block lg:hidden">LG</span>
  <span className="hidden lg:block xl:hidden">XL</span>
  <span className="hidden xl:block">2XL+</span>
</div>
```

### Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device or enter custom dimensions
4. Test responsive behavior

### Common Issues
| Issue | Solution |
|-------|----------|
| Horizontal overflow | Add `overflow-x-hidden` to parent, check for fixed widths |
| Text too small | Use responsive text utilities: `text-sm sm:text-base` |
| Touch targets too small | Ensure min-h-[44px] on buttons/links |
| Layout shifts | Add explicit widths/heights, use aspect-ratio |
| Sidebar not opening | Check device detection, Sheet component imports |

## 📚 Resources

### Documentation
- **Tailwind CSS Breakpoints**: https://tailwindcss.com/docs/responsive-design
- **Framer Motion**: https://www.framer.com/motion/
- **shadcn/ui Components**: https://ui.shadcn.com/

### Design System Files
- `src/lib/responsive.ts` - Core design system
- `src/styles/typography.ts` - Typography scales
- `src/hooks/useParallax.ts` - Scroll effects (mobile-aware)

### Key Components
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/Landing.tsx`
- `src/pages/Upload.tsx`

## 🚀 Quick Start

### Using the Design System
```typescript
import { 
  gridLayouts, 
  responsiveGap, 
  responsivePadding,
  responsiveText,
  isMobile,
  isTablet,
  isDesktop
} from '@/lib/responsive';

function MyComponent() {
  const deviceType = isMobile() ? 'mobile' : isTablet() ? 'tablet' : 'desktop';
  
  return (
    <div className={`${gridLayouts.features} ${responsiveGap.lg} ${responsivePadding.section}`}>
      <h2 className={responsiveText.h1}>Title</h2>
      <p className={responsiveText.bodyLg}>Content</p>
    </div>
  );
}
```

### Creating New Responsive Components
1. **Import utilities**: `import { ... } from '@/lib/responsive'`
2. **Use device detection**: `const [isMobileView, setIsMobileView] = useState(isMobile())`
3. **Apply responsive classes**: Use Tailwind responsive prefixes (sm:, md:, lg:)
4. **Test on all breakpoints**: 320px → 2560px
5. **Verify touch targets**: All buttons/links ≥ 44px
6. **Check accessibility**: Screen reader, keyboard nav, zoom

## ✨ Best Practices Summary

1. ✅ **Mobile-first**: Start with mobile, enhance for desktop
2. ✅ **Touch targets**: Minimum 44px × 44px
3. ✅ **Fluid typography**: Scale text with viewport
4. ✅ **Adaptive spacing**: More space on larger screens
5. ✅ **Content reflow**: Stack on mobile, spread on desktop
6. ✅ **Performance**: Optimize animations, images, layout shifts
7. ✅ **Accessibility**: Keyboard nav, screen readers, color contrast
8. ✅ **Testing**: Test on real devices, multiple browsers

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: Production Ready ✅
