/**
 * Section Component
 * 
 * Reusable editorial section wrapper.
 * Controls spacing, layout, and consistency across landing page.
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { sectionVariants, prefersReducedMotion, analyticalViewport } from '@/animations/analyticalVariants';
import { section } from '@/styles/spacing';
import { colors } from '@/styles/colors';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerSize?: 'narrow' | 'medium' | 'wide' | 'full';
  spacing?: 'desktop' | 'tablet' | 'mobile';
  background?: 'default' | 'subtle';
  animate?: boolean;
  id?: string;
}

export function Section({
  children,
  className = '',
  containerSize = 'wide',
  spacing = 'desktop',
  background = 'default',
  animate = true,
  id
}: SectionProps) {
  const containerClass = section.container[containerSize];
  const spacingClass = section.padding[spacing];
  const backgroundClass = background === 'subtle' ? colors.surface.subtle : '';

  return (
    <motion.section
      id={id}
      className={cn(
        spacingClass,
        backgroundClass,
        className
      )}
      initial={animate && !prefersReducedMotion ? "hidden" : undefined}
      whileInView={animate && !prefersReducedMotion ? "visible" : undefined}
      viewport={analyticalViewport}
      variants={animate && !prefersReducedMotion ? sectionVariants : undefined}
    >
      <div className={containerClass}>
        {children}
      </div>
    </motion.section>
  );
}

/**
 * Section Header
 * For consistent section titles with optional subtitle
 */
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={cn('max-w-3xl mb-16 md:mb-24', alignClass, className)}>
      <h2 className="font-display text-heading-lg md:text-heading-xl lg:text-display-lg text-foreground mb-6">
        {title}
      </h2>
      {subtitle && (
        <p className="text-body-md md:text-body-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Section Separator
 * Pitch-line inspired divider between sections
 */
export function SectionSeparator({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={cn('relative h-px my-24 md:my-32', className)}
      initial={!prefersReducedMotion ? { scaleX: 0, opacity: 0 } : undefined}
      whileInView={!prefersReducedMotion ? { scaleX: 1, opacity: 0.15 } : undefined}
      viewport={{ once: true }}
      transition={{
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        transformOrigin: 'left',
        ...(prefersReducedMotion && { opacity: 0.15 })
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </motion.div>
  );
}
