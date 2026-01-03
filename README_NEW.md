# Atlas - L'intelligence tactique du football par l'IA

> Analyse de matchs de football propulsée par l'IA avec visualisation tactique avancée

## ✨ Features

- 🎥 **Video Analysis**: Upload match footage and get AI-powered tactical insights
- 🔥 **Dynamic Heatmaps**: Visualize player movement and team intensity
- 🧠 **Formation Detection**: Automatic identification of team formations
- 📊 **Interactive Dashboard**: Real-time stats and analytics
- 📱 **Fully Responsive**: Perfect experience from mobile to 4K displays (320px - 2560px)
- 🎨 **Premium UI**: High-end SaaS design with smooth animations

## 🎯 Responsive Design

Atlas features a comprehensive responsive design system that works flawlessly across ALL screen sizes:
- 📱 **Mobile** (320px+): Drawer navigation, touch-optimized interface
- 📱 **Tablet** (768px+): Adaptive layouts, collapsible sidebar
- 💻 **Desktop** (1024px+): Full-featured interface, persistent sidebar
- 🖥️ **4K** (2560px): Optimized for ultra-wide displays

**Documentation**:
- [`RESPONSIVE_GUIDE.md`](RESPONSIVE_GUIDE.md) - Complete implementation guide (2500+ words)
- [`RESPONSIVE_SUMMARY.md`](RESPONSIVE_SUMMARY.md) - What was implemented
- [`VISUAL_TEST_GUIDE.md`](VISUAL_TEST_GUIDE.md) - Quick testing checklist

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ & npm
- Python 3.13+ (for backend)

### Frontend Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server (accessible on network)
npm run dev
# Opens on http://localhost:5173 and http://0.0.0.0:5173
```

### Backend Setup

```sh
cd backend/auth_service

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start backend server
python -m app.main
# Runs on http://0.0.0.0:8001
```

### Access from Mobile Devices

Connect from any device on your network:
- **Frontend**: `http://[YOUR_IP]:5173`
- **Backend**: `http://[YOUR_IP]:8001`

See [`NETWORK_ACCESS.md`](NETWORK_ACCESS.md) for detailed setup.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3 + TypeScript
- **Build Tool**: Vite 5.4
- **UI Library**: shadcn/ui + Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: lucide-react
- **Routing**: React Router v6

### Backend
- **Framework**: FastAPI + Python 3.13
- **Database**: SQLite
- **Auth**: JWT + bcrypt
- **CORS**: Configured for network access

## 📱 Testing Responsive Design

### Chrome DevTools
1. Press `F12` to open DevTools
2. Press `Ctrl+Shift+M` for device toolbar
3. Test these sizes:
   - **iPhone SE** (375px) - Mobile drawer
   - **iPad** (768px) - Tablet layout
   - **Laptop** (1280px) - Desktop view
   - **Desktop** (1920px) - Full experience
   - **4K** (2560px) - Ultra-wide

### Real Devices
Open on your phone/tablet using network IP:
```
http://[YOUR_IP]:5173
```

### Key Features to Test
- ✅ Sidebar drawer on mobile (Sheet component)
- ✅ Dashboard grid adaptation (1 → 2 → 4 columns)
- ✅ Touch targets (≥44px minimum)
- ✅ Typography scaling (responsive text utilities)
- ✅ Form layouts (stack on mobile)

See [`VISUAL_TEST_GUIDE.md`](VISUAL_TEST_GUIDE.md) for complete checklist.

## 📂 Project Structure

```
Atlas/
├── src/
│   ├── components/      # React components
│   │   ├── layout/      # Sidebar (mobile drawer), MainLayout
│   │   ├── dashboard/   # Dashboard widgets (StatCard, etc.)
│   │   ├── landing/     # Landing page sections
│   │   ├── upload/      # Upload components (UploadZone)
│   │   └── ui/          # shadcn/ui components (Sheet, Button, etc.)
│   ├── pages/           # Route pages
│   │   ├── Dashboard.tsx    # Responsive dashboard
│   │   ├── Landing.tsx      # Mobile-optimized landing
│   │   └── Upload.tsx       # Responsive upload page
│   ├── lib/             # Utilities
│   │   └── responsive.ts    # ⭐ Responsive design system (350+ lines)
│   ├── hooks/           # Custom hooks
│   └── styles/          # Global styles, typography
├── backend/             # FastAPI backend
│   └── auth_service/    # Authentication service
├── public/              # Static assets
└── docs/                # Documentation
    ├── RESPONSIVE_GUIDE.md      # Complete guide
    ├── RESPONSIVE_SUMMARY.md    # What was implemented
    ├── VISUAL_TEST_GUIDE.md     # Testing checklist
    └── NETWORK_ACCESS.md        # Network setup
```

## 🎨 Design System

### Breakpoints
```typescript
xs:  320px   // iPhone SE
sm:  640px   // Large phones
md:  768px   // Tablets
lg:  1024px  // Laptops
xl:  1280px  // Desktops
2xl: 1536px  // Large displays
3xl: 1920px  // Full HD
4xl: 2560px  // 4K
```

### Key Utilities
```typescript
import { 
  gridLayouts,          // 14 pre-configured responsive grids
  responsiveGap,        // Adaptive spacing utilities
  responsivePadding,    // Responsive padding scales
  responsiveText,       // 10+ typography scales
  isMobile, isTablet,   // Device detection functions
  getCurrentBreakpoint  // Get current breakpoint name
} from '@/lib/responsive';
```

### Example Usage
```typescript
// Responsive grid (1 col → 2 cols → 4 cols)
<div className={`${gridLayouts.stats} ${responsiveGap.md}`}>
  <StatCard title="Total" value="24" />
</div>

// Device detection
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

// Responsive typography
<h1 className={responsiveText.displayXl}>Title</h1>
<p className={responsiveText.bodyMd}>Body text</p>
```

## 🧪 Responsive Implementation Details

### Sidebar Component
- **Mobile (<768px)**: Sheet drawer overlay from left (280-320px)
- **Desktop (≥768px)**: Persistent collapsible sidebar (64px/256px)
- **Features**: Device detection, auto-close on navigation, 44px touch targets

### Dashboard Page
- **Header**: Stacks on mobile, horizontal on tablet+
- **Stats Grid**: 1 col → 2 cols → 4 cols
- **Main Content**: 1 col → 3 cols (2+1 split)
- **Bottom Row**: 1 col → 2 cols

### Landing Page
- **Spacing**: Mobile-optimized (py-12 sm:py-16 md:py-20 lg:py-32)
- **Typography**: Responsive scaling across all sections
- **Touch Targets**: Footer links 44px minimum

### Upload Page
- **Upload Zone**: Adaptive padding (p-8 sm:p-12)
- **Feature Grid**: 1 col → 2 cols → 3 cols
- **Buttons**: Full-width on mobile, auto on desktop

## 🚀 Deployment

### Frontend (Lovable)
1. Visit your [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
2. Click **Share → Publish**
3. Your app is live!

### Backend (Any Python Host)
- Heroku
- Railway
- Render
- AWS/GCP/Azure
- Vercel (with Python runtime)

### Custom Domain
1. Navigate to **Project > Settings > Domains**
2. Click **Connect Domain**
3. Follow DNS configuration steps

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain)

## 📖 Documentation

| Document | Description | Lines |
|----------|-------------|-------|
| [`RESPONSIVE_GUIDE.md`](RESPONSIVE_GUIDE.md) | Complete responsive implementation guide | 2500+ |
| [`RESPONSIVE_SUMMARY.md`](RESPONSIVE_SUMMARY.md) | What was implemented, before/after | 1000+ |
| [`VISUAL_TEST_GUIDE.md`](VISUAL_TEST_GUIDE.md) | Quick testing checklist with DevTools tips | 500+ |
| [`NETWORK_ACCESS.md`](NETWORK_ACCESS.md) | Network configuration for mobile testing | 300+ |

## 🤝 Contributing

### Ways to Edit
1. **Lovable IDE**: Prompt and auto-commit changes
2. **Local IDE**: Clone, edit, push (syncs with Lovable)
3. **GitHub**: Edit files directly in browser
4. **Codespaces**: Full VS Code environment in browser

### Development Workflow
1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test responsiveness:
   - Chrome DevTools (F12 → Ctrl+Shift+M)
   - Real devices on network
   - All breakpoints (320px - 2560px)
5. Verify touch targets (≥44px)
6. Check accessibility (keyboard nav, screen reader)
7. Commit and push
8. Changes sync with Lovable automatically

## 🎯 Development Tips

### Responsive Best Practices
1. **Mobile-first**: Design for mobile, enhance for desktop
2. **Use design system**: Import from `responsive.ts`
3. **Test all breakpoints**: 320px, 768px, 1024px, 1920px, 2560px
4. **Verify touch targets**: All buttons/links ≥ 44px
5. **Check keyboard nav**: Tab through all interactive elements
6. **Test on real devices**: Phone, tablet, laptop, desktop

### Quick Testing
```typescript
// Add to component to see current breakpoint
<div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
  {getCurrentBreakpoint()} - {window.innerWidth}px
</div>
```

### Common Patterns
```typescript
// Responsive container
<div className={responsivePadding.page}>
  {/* p-4 sm:p-6 md:p-8 */}
</div>

// Responsive grid
<div className={gridLayouts.features}>
  {/* 1 col → 2 cols → 3 cols */}
</div>

// Responsive text
<h2 className={responsiveText.h1}>
  {/* 1.875rem → 2.5rem */}
</h2>

// Stacking layout
<div className="flex flex-col sm:flex-row gap-4">
  {/* Vertical on mobile, horizontal on tablet+ */}
</div>
```

## 📊 Project Status

| Feature | Status | Notes |
|---------|--------|-------|
| **Frontend** | ✅ Production-ready | React 18 + TypeScript + Vite |
| **Responsive Design** | ✅ Fully implemented | 320px - 2560px, mobile-first |
| **UI Components** | ✅ Complete | shadcn/ui + Tailwind CSS |
| **Animations** | ✅ Production-ready | Framer Motion, reduced-motion aware |
| **Backend Auth** | ✅ Ready | FastAPI + JWT + SQLite |
| **AI Analysis** | 🚧 In development | Video processing pipeline |
| **Deployment** | ✅ Ready | Lovable + custom domain support |

## 🏆 What Makes Atlas Special

### Fully Responsive
- ✅ Works on **every device** from iPhone SE to 4K displays
- ✅ Mobile-first design with **touch-optimized** interface
- ✅ **44px minimum** touch targets for accessibility
- ✅ Adaptive layouts, typography, and spacing

### Premium User Experience
- ✅ Smooth animations with **Framer Motion**
- ✅ **High-end SaaS** design language
- ✅ Scroll parallax effects (mobile-aware)
- ✅ Glass morphism and subtle gradients

### Developer-Friendly
- ✅ Comprehensive **design system** (350+ lines)
- ✅ Reusable utilities and components
- ✅ TypeScript for type safety
- ✅ Well-documented with examples

### Network-Ready
- ✅ **0.0.0.0 binding** for network access
- ✅ CORS configured for all origins
- ✅ Test on **real devices** on same network
- ✅ Perfect for **demos and presentations**

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Typography: Inter + DM Sans

---

**Made with ❤️ for the future of football analysis**

**Status**: ✅ Production Ready | **Last Updated**: January 2025 | **Version**: 1.0
