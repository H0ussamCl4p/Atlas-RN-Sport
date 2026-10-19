/**
 * Data Visual Component
 * 
 * Minimal chart/graph for displaying analytical metrics.
 * Line charts, bar comparisons, zone occupation.
 * Pure data, no decoration.
 */

import { motion } from 'framer-motion';
import { dataRevealVariants, prefersReducedMotion } from '@/animations/analyticalVariants';

interface DataPoint {
  label: string;
  value: number; // 0-100
}

interface DataVisualProps {
  data?: DataPoint[];
  type?: 'bar' | 'line';
  title?: string;
  className?: string;
}

const defaultData: DataPoint[] = [
  { label: 'Possession', value: 62 },
  { label: 'Passes', value: 78 },
  { label: 'Duels', value: 45 },
  { label: 'Pressing', value: 71 },
  { label: 'Transitions', value: 58 },
];

export function DataVisual({ 
  data = defaultData,
  type = 'bar',
  title = 'Métriques tactiques',
  className = '' 
}: DataVisualProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={`relative w-full rounded-lg overflow-hidden border border-border/50 bg-card/30 ${className}`}>
      <div className="p-6 md:p-8">
        {/* Title */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
            {title}
          </h3>
        </div>

        {/* Chart */}
        {type === 'bar' && (
          <div className="space-y-6">
            {data.map((point, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted-foreground">
                    {point.label}
                  </span>
                  <span className="text-lg font-semibold text-foreground tabular-nums">
                    {point.value}%
                  </span>
                </div>
                
                {/* Bar */}
                <div className="relative h-1 bg-border/50 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    initial={!prefersReducedMotion ? { scaleX: 0 } : undefined}
                    whileInView={!prefersReducedMotion ? { scaleX: point.value / 100 } : undefined}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    style={{
                      transformOrigin: 'left',
                      ...(prefersReducedMotion && { transform: `scaleX(${point.value / 100})` })
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {type === 'line' && (
          <svg
            viewBox="0 0 300 150"
            className="w-full h-32"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={150 - (y * 1.5)}
                x2="300"
                y2={150 - (y * 1.5)}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border"
                opacity="0.3"
              />
            ))}

            {/* Line path */}
            <motion.polyline
              points={data.map((d, i) => 
                `${(i / (data.length - 1)) * 300},${150 - (d.value * 1.5)}`
              ).join(' ')}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={!prefersReducedMotion ? { pathLength: 0, opacity: 0 } : undefined}
              whileInView={!prefersReducedMotion ? { pathLength: 1, opacity: 1 } : undefined}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 1.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />

            {/* Data points */}
            {data.map((d, i) => (
              <motion.circle
                key={i}
                cx={(i / (data.length - 1)) * 300}
                cy={150 - (d.value * 1.5)}
                r="3"
                fill="hsl(var(--primary))"
                initial={!prefersReducedMotion ? { scale: 0, opacity: 0 } : undefined}
                whileInView={!prefersReducedMotion ? { scale: 1, opacity: 1 } : undefined}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.1 + 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              />
            ))}
          </svg>
        )}
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/5 to-transparent pointer-events-none" />
    </div>
  );
}
