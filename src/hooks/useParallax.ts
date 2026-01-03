import { useEffect, useState } from 'react';
import { useScroll, useTransform, MotionValue } from 'framer-motion';

interface ParallaxOptions {
  offset?: number; // Vertical offset in pixels (default: 40)
  range?: [number, number]; // Scroll progress range to map (default: [0, 1])
  inverted?: boolean; // Reverse the direction
}

/**
 * Custom hook for scroll-based parallax effects
 * 
 * @param offset - Vertical offset in pixels (±20-40px recommended)
 * @param options - Additional configuration options
 * @returns MotionValue for translateY transform
 * 
 * @example
 * const y = useParallax(40);
 * <motion.div style={{ y }}>Parallax content</motion.div>
 */
export function useParallax(
  offset: number = 40,
  options: ParallaxOptions = {}
): MotionValue<number> | number {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const {
    range = [0, 1],
    inverted = false,
  } = options;

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Get scroll progress
  const { scrollYProgress } = useScroll();

  // Calculate transform range based on direction
  const outputRange = inverted 
    ? [offset, -offset]
    : [-offset, offset];

  // Transform scroll progress to parallax offset
  const y = useTransform(scrollYProgress, range, outputRange);

  // Return 0 if user prefers reduced motion
  return prefersReducedMotion ? 0 : y;
}

/**
 * Hook for element-specific parallax (tracks specific element scroll)
 * 
 * @param ref - React ref to the target element
 * @param offset - Vertical offset in pixels
 * @returns MotionValue for translateY transform
 */
export function useElementParallax(
  offset: number = 40,
  options: ParallaxOptions = {}
): MotionValue<number> | number {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const {
    range = [0, 1],
    inverted = false,
  } = options;

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Get scroll progress
  const { scrollYProgress } = useScroll();

  // Calculate transform range
  const outputRange = inverted 
    ? [offset, -offset]
    : [-offset, offset];

  // Transform scroll progress to parallax offset
  const y = useTransform(scrollYProgress, range, outputRange);

  return prefersReducedMotion ? 0 : y;
}
