import { motion, Easing } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PitchLinesProps {
  variant?: 'hero' | 'showcase';
  className?: string;
  animate?: boolean;
}

/**
 * Animated SVG football pitch lines
 * 
 * Features:
 * - Center circle, halfway line, penalty boxes
 * - Stroke-dasharray animation (lines "draw" themselves)
 * - Subtle, background-level opacity
 * - Responsive and scalable
 * - Respects prefers-reduced-motion
 */
export function PitchLines({ 
  variant = 'hero', 
  className = '',
  animate = true 
}: PitchLinesProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    
    setPrefersReducedMotion(mediaQuery.matches);
    setIsMobile(mobileQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    mobileQuery.addEventListener('change', handleMobileChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      mobileQuery.removeEventListener('change', handleMobileChange);
    };
  }, []);

  // Hero variant: minimal, top-down view
  // Showcase variant: perspective, 3D feel
  const isHero = variant === 'hero';
  
  // Animation configuration - simplified on mobile
  const shouldAnimate = animate && !prefersReducedMotion && !isMobile;
  
  // Draw animation for lines
  const drawVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: (custom: number) => ({
      pathLength: 1,
      opacity: 0.15,
      transition: {
        pathLength: {
          duration: 1.5,
          delay: custom * 0.2,
          ease: [0.25, 0.1, 0.25, 1] as Easing,
        },
        opacity: {
          duration: 0.5,
          delay: custom * 0.2,
        },
      },
    }),
  };

  const staticOpacity = 0.15;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradient for subtle depth */}
          <linearGradient id="pitchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Center circle */}
        <motion.circle
          cx="500"
          cy="300"
          r="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          custom={0}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity } : undefined}
        />

        {/* Center dot */}
        <motion.circle
          cx="500"
          cy="300"
          r="4"
          fill="currentColor"
          className="text-primary"
          initial={shouldAnimate ? { scale: 0, opacity: 0 } : false}
          animate={shouldAnimate ? { 
            scale: 1, 
            opacity: 0.3,
            transition: { delay: 0.5, duration: 0.4 }
          } : false}
          style={!shouldAnimate ? { opacity: 0.3 } : undefined}
        />

        {/* Halfway line */}
        <motion.line
          x1="500"
          y1="0"
          x2="500"
          y2="600"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          custom={1}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity } : undefined}
        />

        {/* Top penalty box (simplified) */}
        <motion.rect
          x="350"
          y="50"
          width="300"
          height="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          custom={2}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity } : undefined}
        />

        {/* Top penalty arc */}
        <motion.path
          d="M 420 170 Q 500 200 580 170"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          custom={2.5}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity } : undefined}
        />

        {/* Bottom penalty box (simplified) */}
        <motion.rect
          x="350"
          y="430"
          width="300"
          height="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          custom={3}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity } : undefined}
        />

        {/* Bottom penalty arc */}
        <motion.path
          d="M 420 430 Q 500 400 580 430"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          custom={3.5}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity } : undefined}
        />

        {/* Corner arcs - top left */}
        <motion.path
          d="M 0 30 Q 0 0 30 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          custom={4}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity } : undefined}
        />

        {/* Corner arcs - top right */}
        <motion.path
          d="M 970 0 Q 1000 0 1000 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          custom={4.5}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity } : undefined}
        />

        {/* Corner arcs - bottom left */}
        <motion.path
          d="M 0 570 Q 0 600 30 600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          custom={5}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity } : undefined}
        />

        {/* Corner arcs - bottom right */}
        <motion.path
          d="M 970 600 Q 1000 600 1000 570"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          custom={5.5}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity } : undefined}
        />

        {/* Pitch border */}
        <motion.rect
          x="10"
          y="10"
          width="980"
          height="580"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary"
          custom={6}
          initial={shouldAnimate ? "hidden" : false}
          animate={shouldAnimate ? "visible" : false}
          variants={shouldAnimate ? drawVariants : undefined}
          style={!shouldAnimate ? { opacity: staticOpacity * 0.8 } : undefined}
        />
      </svg>

      {/* Subtle overlay gradient for depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50"
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );
}
