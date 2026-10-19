/**
 * Scroll Indicator
 * 
 * Subtle scroll prompt at bottom of hero section.
 * Minimal, analytical, purposeful.
 * 
 * DESIGN PHILOSOPHY:
 * - Low opacity, calm animation
 * - No bounce, no playfulness
 * - Disappears after scroll
 * - One purpose: indicate "continue reading"
 */

import { motion, useScroll } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { prefersReducedMotion } from '@/animations/analyticalVariants';

interface ScrollIndicatorProps {
  targetSectionId?: string;
  className?: string;
}

export function ScrollIndicator({ 
  targetSectionId = 'features',
  className = '' 
}: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { scrollY } = useScroll();

  // Hide after scrolling past hero
  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setIsVisible(latest < 400);
    });
  }, [scrollY]);

  const handleClick = () => {
    const element = document.getElementById(targetSectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={cn(
        'fixed bottom-12 left-1/2 -translate-x-1/2 z-30',
        'flex flex-col items-center gap-2',
        className
      )}
      {...(!prefersReducedMotion && {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 1, delay: 2, ease: [0.25, 0.1, 0.25, 1] },
      })}
    >
      {/* Label */}
      <span className="text-xs uppercase tracking-widest text-muted-foreground/50 font-medium">
        Défiler
      </span>

      {/* Arrow Button */}
      <motion.button
        onClick={handleClick}
        className={cn(
          'p-2 text-muted-foreground/50 hover:text-foreground transition-colors',
          'focus:outline-none focus:text-foreground',
          'rounded-full hover:bg-muted/30'
        )}
        aria-label="Défiler vers le bas"
        {...(!prefersReducedMotion && {
          animate: {
            y: [0, 8, 0],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: [0.25, 0.1, 0.25, 1],
          },
        })}
      >
        <ChevronDown className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
