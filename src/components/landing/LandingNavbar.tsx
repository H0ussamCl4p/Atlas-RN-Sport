/**
 * Landing Navbar
 * 
 * Minimal, editorial navigation for the landing page.
 * Publication-like aesthetic - calm, institutional, trustworthy.
 * 
 * DESIGN PHILOSOPHY:
 * - Transparent by default, subtle background on scroll
 * - Typography-first, no logo images
 * - Smooth scroll to sections
 * - Mobile: clean stacked menu
 * - Authority > marketing
 */

import { motion, useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/animations/analyticalVariants';

interface NavItem {
  label: string;
  href?: string;
  sectionId?: string;
  type: 'scroll' | 'route';
}

const navItems: NavItem[] = [
  { label: 'Produit', sectionId: 'features', type: 'scroll' },
  { label: 'Méthodologie', sectionId: 'methodology', type: 'scroll' },
  { label: 'Connexion', href: '/login', type: 'route' },
];

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  // Detect scroll for background fade-in
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsScrolled(latest > 100);
    });
  }, [scrollY]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  // Handle navigation
  const handleNavClick = (item: NavItem) => {
    if (item.type === 'scroll' && item.sectionId) {
      scrollToSection(item.sectionId);
    } else if (item.type === 'route' && item.href) {
      navigate(item.href);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          'border-b border-border/0',
          isScrolled && 'border-border/50 bg-background/80 backdrop-blur-md'
        )}
        {...(!prefersReducedMotion && {
          initial: { y: -100, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
        })}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Wordmark */}
            <Link
              to="/"
              className="text-xl md:text-2xl font-bold text-foreground tracking-tight hover:text-primary transition-colors"
            >
              Atlas
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    'text-sm font-medium text-muted-foreground',
                    'hover:text-foreground transition-colors',
                    'focus:outline-none focus:text-foreground',
                    'relative group'
                  )}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                </button>
              ))}

              {/* Primary CTA */}
              <Link
                to="/register"
                className={cn(
                  'px-6 py-2.5 text-sm font-medium',
                  'text-primary-foreground bg-primary',
                  'rounded-sm',
                  'hover:bg-primary/90 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
                )}
              >
                Créer un compte
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-sm'
              )}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          {...(!prefersReducedMotion && {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.3 },
          })}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <motion.div
            className="relative h-full flex flex-col pt-24 px-4"
            {...(!prefersReducedMotion && {
              initial: { y: 20, opacity: 0 },
              animate: { y: 0, opacity: 1 },
              transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
            })}
          >
            <nav className="space-y-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    'w-full text-left px-4 py-4 text-lg font-medium',
                    'text-foreground hover:bg-muted/50 transition-colors rounded-sm',
                    'focus:outline-none focus:bg-muted/50',
                    'border-b border-border/50 last:border-0'
                  )}
                  {...(!prefersReducedMotion && {
                    initial: { x: -20, opacity: 0 },
                    animate: { x: 0, opacity: 1 },
                    transition: {
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                  })}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Mobile CTA */}
              <motion.div
                className="pt-6"
                {...(!prefersReducedMotion && {
                  initial: { x: -20, opacity: 0 },
                  animate: { x: 0, opacity: 1 },
                  transition: {
                    duration: 0.4,
                    delay: navItems.length * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  },
                })}
              >
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'block w-full px-4 py-4 text-lg font-medium text-center',
                    'text-primary-foreground bg-primary',
                    'rounded-sm',
                    'hover:bg-primary/90 transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
                  )}
                >
                  Créer un compte
                </Link>
              </motion.div>
            </nav>

            {/* Footer note */}
            <div className="mt-auto pb-8 pt-12 text-center">
              <p className="text-sm text-muted-foreground">
                L'intelligence tactique du football
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
