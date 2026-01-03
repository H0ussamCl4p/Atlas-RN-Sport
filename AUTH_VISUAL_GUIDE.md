# 🎨 Atlas Authentication - Visual Guide

## 📸 User Journey

### 1️⃣ Login Screen

```
┌─────────────────────────────────────────┐
│                                         │
│              [🛡️ Shield Icon]            │
│                                         │
│                 Atlas                   │
│   Plateforme d'analyse tactique         │
│              football                   │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ 🔐 Connexion                       │ │
│  │                                    │ │
│  │ ℹ️ Compte de démonstration         │ │
│  │   pour les juges RN Sport 2026     │ │
│  │                                    │ │
│  │ Email                              │ │
│  │ ┌──────────────────────────────┐   │ │
│  │ │ demo@atlas.ai                │   │ │
│  │ └──────────────────────────────┘   │ │
│  │                                    │ │
│  │ Mot de passe                       │ │
│  │ ┌──────────────────────────────┐   │ │
│  │ │ ••••••••                     │   │ │
│  │ └──────────────────────────────┘   │ │
│  │                                    │ │
│  │   [✨ Se connecter]                 │ │
│  │                                    │ │
│  │ Hackathon RN Sport 2026            │ │
│  │ Atlas Football Analytics           │ │
│  └────────────────────────────────────┘ │
│                                         │
│    © 2026 Atlas. Tous droits réservés  │
└─────────────────────────────────────────┘
```

**Features:**
- ✅ Pre-filled demo credentials
- ✅ Professional Atlas branding
- ✅ Demo account notice for judges
- ✅ Smooth animations and transitions
- ✅ Dark/light theme support
- ✅ Error messages displayed as alerts
- ✅ Loading spinner during authentication

---

### 2️⃣ Protected Dashboard

```
┌──────────┬────────────────────────────────────────┐
│          │                                        │
│  [⚡]    │  Tableau de bord                       │
│  Atlas   │  Bienvenue, Coach. Voici un aperçu... │
│          │                                        │
│ ────────│                                        │
│          │  [📊 Statistics Cards]                │
│ 📊 Dash  │                                        │
│ 📤 Upload│  [📈 Recent Analysis]                 │
│ 🎥 Analys│                                        │
│ ⚙️  Param│  [⚽ Football Pitch Visualization]    │
│          │                                        │
│ ────────│                                        │
│          │                                        │
│ 👤       │                                        │
│ demo@    │                                        │
│ atlas.ai │                                        │
│          │                                        │
│ [🚪 Déco]│                                        │
│ [⬅ Réd] │                                        │
└──────────┴────────────────────────────────────────┘
```

**Features:**
- ✅ User email displayed in sidebar
- ✅ Logout button ("Déconnexion")
- ✅ All original Atlas functionality
- ✅ Session persists on page refresh
- ✅ Automatic redirect if not authenticated

---

## 🔄 State Transitions

### Authentication States

```
┌─────────────────┐
│  UNAUTHENTICATED │
│  (No tokens)     │
└────────┬─────────┘
         │
         │ User submits login
         │
         ▼
┌─────────────────┐
│   LOGGING IN    │
│  (API request)  │
└────────┬─────────┘
         │
         │ Success: Store tokens
         │
         ▼
┌─────────────────┐
│  AUTHENTICATED  │
│  (Has tokens)   │
└────────┬─────────┘
         │
         │ User clicks logout
         │ OR token refresh fails
         │
         ▼
┌─────────────────┐
│  UNAUTHENTICATED │
│  (Tokens cleared)│
└─────────────────┘
```

---

### Route Protection Flow

```
User navigates to /upload
         │
         ▼
    ProtectedRoute checks auth
         │
    ┌────┴────┐
    │         │
Authenticated? │
    │         │
  YES        NO
    │         │
    ▼         ▼
 Show    Redirect to
Upload    /login
 Page
```

---

### Token Refresh Flow

```
API Request
    │
    ▼
  401 Error?
    │
    ├─ No → Return response
    │
    ▼
   Yes → Check if refreshing
    │
    ├─ Already refreshing? → Queue request
    │
    ▼
   No → POST /auth/refresh
    │
    ├─ Success? → Update tokens
    │              Retry queued requests
    │
    ▼
   Failure → Logout + redirect to login
```

---

## 🎯 Key UI Elements

### Login Button States

**Default:**
```
┌──────────────────────┐
│  ✨ Se connecter     │  ← Glow effect
└──────────────────────┘
```

**Loading:**
```
┌──────────────────────┐
│  ⟳ Connexion en...  │  ← Spinner animating
└──────────────────────┘
```

**Disabled (has error):**
```
┌──────────────────────┐
│  ✨ Se connecter     │  ← Dimmed
└──────────────────────┘
```

---

### Error Display

```
┌─────────────────────────────────────┐
│ ❌ Email or password is incorrect   │
└─────────────────────────────────────┘
```

---

### Loading Screen (Initial Load)

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│          ⟳  (spinning)              │
│                                     │
│          Chargement...              │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎨 Design Tokens

### Colors Used

```
Primary:        hsl(160 84% 39%)     ← Atlas brand green
Background:     hsl(0 0% 3.9%)       ← Dark mode
Card:           hsl(0 0% 14.9%)      ← Cards/modals
Border:         hsl(0 0% 14.9%)      ← Borders
Foreground:     hsl(0 0% 98%)        ← Text
Muted:          hsl(0 0% 63.9%)      ← Helper text
```

### Components Used

- **Card** - Login form container
- **Input** - Email & password fields
- **Label** - Form field labels
- **Button** - Submit button with "glow" variant
- **Alert** - Demo notice & errors
- **Loader2** (Lucide) - Loading spinner
- **Shield** (Lucide) - Branding icon

---

## 📱 Responsive Behavior

### Mobile (< 640px)
```
┌──────────────┐
│   [Logo]     │
│              │
│ [Login Form] │
│              │
│   [Footer]   │
└──────────────┘
```

### Desktop (> 640px)
```
┌────────────────────────────┐
│         [Logo]             │
│                            │
│    [Login Form - 400px]    │
│                            │
│         [Footer]           │
└────────────────────────────┘
```

---

## ✨ Animations

### Page Transitions
- Fade in login form: `300ms ease-in-out`
- Redirect to dashboard: Instant (no flicker)

### Button Hover
- Glow effect: `transition-all duration-300`
- Shadow intensifies on hover

### Loading Spinner
- Rotate 360°: `animate-spin` (infinite)

### Error Alert
- Slide in from top: `200ms ease-out`

---

## 🎬 Demo Day Presentation

### Recommended Flow:

1. **Show Login Screen** (5 seconds)
   - "Here's our professional authentication"
   - Point out pre-filled credentials
   - Mention demo account for judges

2. **Click Login** (instant)
   - Show loading state
   - Emphasize smooth transition

3. **Arrive at Dashboard** (2 seconds)
   - "Session is authenticated"
   - Show user email in sidebar

4. **Refresh Page** (F5)
   - "Session persists across refreshes"
   - No need to login again

5. **Click Logout** (instant)
   - "Clean logout flow"
   - Back to login screen

**Total time: ~15 seconds**

---

## 🔐 Security Visual

### Token Storage Strategy

```
┌──────────────────────────────────────┐
│           Browser Memory             │
├──────────────────────────────────────┤
│ Access Token                         │
│ • Short-lived (15 minutes)           │
│ • Lost on page refresh               │
│ • XSS protection ✓                   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│          localStorage                │
├──────────────────────────────────────┤
│ Refresh Token                        │
│ • Long-lived (7 days)                │
│ • Survives page refresh              │
│ • Used to get new access token       │
└──────────────────────────────────────┘
```

---

**This visual guide shows exactly what judges will see during the demo! 🎊**
