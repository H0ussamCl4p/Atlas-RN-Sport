import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href?: string;
  sectionId?: string;
  type: 'scroll' | 'route';
}

const leftNavItems: NavItem[] = [
  { label: 'Produit', sectionId: 'features', type: 'scroll' },
  { label: 'Méthodologie', sectionId: 'methodology', type: 'scroll' },
];

const rightNavItems: NavItem[] = [
  { label: 'Métriques', sectionId: 'metrics', type: 'scroll' },
  { label: 'Plateforme', sectionId: 'cta', type: 'scroll' },
];

export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleNavClick = (item: NavItem) => {
    if (item.type === 'scroll' && item.sectionId) {
      scrollToSection(item.sectionId);
    } else if (item.type === 'route' && item.href) {
      navigate(item.href);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="relative z-50 bg-background">
      <div className="mx-auto max-w-[1160px] border-x border-border px-4 sm:px-8 py-5">
        <div className="relative flex items-center justify-between">
          {/* Desktop Centered 3-part Nav inspired by ReadMe.com */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-1 pr-8">
            {leftNavItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
              >
                <span>{item.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* Center Brand Mark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-foreground hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="2.2" />
                <circle cx="12" cy="12" r="2.5" fill="#6EE7B7" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight text-foreground">
              Atlas
            </span>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-start gap-1 pl-8">
            {rightNavItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-foreground transition-colors"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Auth Pill Buttons */}
          <div className="hidden md:flex items-center gap-2 absolute right-0">
            <Link
              to="/login"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-foreground border border-border hover:bg-secondary transition-colors"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="rounded-full px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Commencer
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border space-y-2">
            {[...leftNavItems, ...rightNavItems].map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'w-full text-center py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90'
                )}
              >
                Commencer
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
