/**
 * Node Graph Component
 * 
 * Player connection diagram - pass networks, positioning links.
 * Vector-based, analytical aesthetic.
 * Represents team connectivity and tactical relationships.
 */

import { motion } from 'framer-motion';
import { lineDrawVariants, dataPointVariants, prefersReducedMotion } from '@/animations/analyticalVariants';

interface Node {
  id: number;
  x: number; // 0-100
  y: number; // 0-100
  size?: number;
  label?: string;
}

interface Connection {
  from: number;
  to: number;
  strength: number; // 0-1
}

interface NodeGraphProps {
  nodes?: Node[];
  connections?: Connection[];
  className?: string;
}

const defaultNodes: Node[] = [
  { id: 1, x: 50, y: 20, size: 8, label: '1' },
  { id: 2, x: 25, y: 40, size: 10, label: '6' },
  { id: 3, x: 75, y: 40, size: 10, label: '8' },
  { id: 4, x: 35, y: 60, size: 12, label: '10' },
  { id: 5, x: 65, y: 60, size: 9, label: '7' },
  { id: 6, x: 50, y: 80, size: 11, label: '9' },
];

const defaultConnections: Connection[] = [
  { from: 1, to: 2, strength: 0.8 },
  { from: 1, to: 3, strength: 0.7 },
  { from: 2, to: 4, strength: 0.9 },
  { from: 3, to: 5, strength: 0.85 },
  { from: 4, to: 6, strength: 0.75 },
  { from: 5, to: 6, strength: 0.7 },
  { from: 2, to: 3, strength: 0.6 },
];

export function NodeGraph({ 
  nodes = defaultNodes,
  connections = defaultConnections,
  className = '' 
}: NodeGraphProps) {
  // Helper to find node by ID
  const getNode = (id: number) => nodes.find(n => n.id === id);

  return (
    <div className={`relative w-full aspect-square rounded-lg overflow-hidden border border-border/50 ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-[#F6F9F7]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B3D2E0D_1px,transparent_1px),linear-gradient(to_bottom,#0B3D2E0D_1px,transparent_1px)] bg-[size:28px_28px]" />

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connection lines */}
        {connections.map((conn, i) => {
          const fromNode = getNode(conn.from);
          const toNode = getNode(conn.to);
          
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`conn-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="hsl(var(--primary))"
              strokeWidth={conn.strength * 2}
              strokeOpacity={conn.strength * 0.4}
              strokeLinecap="round"
              custom={i}
              initial={!prefersReducedMotion ? "hidden" : false}
              animate={!prefersReducedMotion ? "visible" : false}
              variants={!prefersReducedMotion ? lineDrawVariants : undefined}
            />
          );
        })}

        {/* Node points */}
        {nodes.map((node, i) => (
          <g key={node.id}>
            {/* Node circle */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size || 8}
              fill="hsl(var(--primary))"
              fillOpacity="0.9"
              custom={i}
              initial={!prefersReducedMotion ? "hidden" : false}
              animate={!prefersReducedMotion ? "visible" : false}
              variants={!prefersReducedMotion ? dataPointVariants : undefined}
            />
            
            {/* Node label */}
            {node.label && (
              <motion.text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="hsl(var(--primary-foreground))"
                fontSize="6"
                fontWeight="600"
                custom={i + 0.2}
                initial={!prefersReducedMotion ? { opacity: 0 } : false}
                animate={!prefersReducedMotion ? { opacity: 1 } : false}
                transition={!prefersReducedMotion ? { delay: i * 0.1 + 0.3, duration: 0.4 } : undefined}
              >
                {node.label}
              </motion.text>
            )}
          </g>
        ))}
      </svg>

      {/* Overlay label */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Réseau de passes
        </span>
      </div>
    </div>
  );
}
