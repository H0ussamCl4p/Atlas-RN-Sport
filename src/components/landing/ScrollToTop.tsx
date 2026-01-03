/**
 * Scroll To Top Button
 * 
 * Minimal button to scroll back to top of page.
 * Appears after scrolling down, hidden at top.
 * 
 * DESIGN PHILOSOPHY:
 * - Low opacity, calm animation
 * - No flashy effects
 * - Analytical, purposeful
 * - Matches landing page aesthetic
 */

import { motion, useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/animations/analyticalVariants';

interface ScrollToTopProps {
  showAfter?: number;
  className?: string;
}

export function ScrollToTop({ 
  showAfter = 400,
  className = '' 
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  // Show after scrolling past threshold
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsVisible(latest > showAfter);
    });
  }, [scrollY, showAfter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 z-40',
        'p-3 rounded-sm',
        'bg-background/80 backdrop-blur-md',
        'border border-border/50',
        'text-muted-foreground hover:text-foreground',
        'hover:border-primary/50 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
        'shadow-lg',
        className
      )}
      aria-label="Retour en haut"
      {...(!prefersReducedMotion && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
      })}
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
}
