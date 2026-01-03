import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Upload, 
  FileVideo, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { isMobile, isTablet } from "@/lib/responsive";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Upload", href: "/upload", icon: Upload },
  { title: "Analyses", href: "/analyses", icon: FileVideo },
  { title: "Paramètres", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const location = useLocation();
  const { user, logout } = useAuth();

  // Detect device type
  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setDeviceType('mobile');
        setCollapsed(false);
      } else if (isTablet()) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    if (deviceType === 'mobile') {
      setMobileOpen(false);
    }
  }, [location.pathname, deviceType]);

  // Sidebar content component
  const SidebarContent = ({ isMobileDrawer = false }: { isMobileDrawer?: boolean }) => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="h-14 sm:h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {(!collapsed || isMobileDrawer) && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-base sm:text-lg text-foreground">
              Atlas
            </span>
          </div>
        )}
        {collapsed && !isMobileDrawer && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
        {isMobileDrawer && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 sm:py-6 px-3 space-y-1 sm:space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group min-h-[44px]",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {(!collapsed || isMobileDrawer) && (
                <span className="font-medium text-sm sm:text-base">{item.title}</span>
              )}
              {isActive && (!collapsed || isMobileDrawer) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {user && (!collapsed || isMobileDrawer) && (
          <div className="px-3 py-2 rounded-lg bg-sidebar-accent/50 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                {user.email}
              </span>
            </div>
            {user.roles && user.roles.length > 0 && (
              <div className="text-xs text-muted-foreground capitalize mt-1">
                {user.roles[0]}
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className={cn(
            "w-full min-h-[44px]",
            collapsed && !isMobileDrawer ? "justify-center px-2" : "justify-start px-3"
          )}
        >
          <LogOut className="w-4 h-4" />
          {(!collapsed || isMobileDrawer) && <span className="ml-2 text-xs sm:text-sm">Déconnexion</span>}
        </Button>

        {!isMobileDrawer && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full justify-center min-h-[44px] hidden md:flex",
              collapsed ? "px-2" : "px-3"
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="ml-2 text-xs sm:text-sm">Réduire</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  // Mobile: Drawer overlay
  if (deviceType === 'mobile') {
    return (
      <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-50 flex items-center px-4 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="min-h-[44px] min-w-[44px]">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 bg-sidebar">
            <SidebarContent isMobileDrawer={true} />
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-base text-foreground">
              Atlas
            </span>
          </div>
        </div>
        
        <div className="w-[44px]" />
      </header>
    );
  }

  // Tablet & Desktop: Persistent sidebar
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-56 sm:w-64",
        "hidden md:flex"
      )}
    >
      <SidebarContent />
    </aside>
  );
}
