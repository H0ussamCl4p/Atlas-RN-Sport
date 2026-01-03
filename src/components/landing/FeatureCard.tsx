/**
 * Feature Card Component
 * 
 * Animated feature card with icon, title, and description.
 * Reveals on scroll with stagger effect.
 */

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  featureCardVariants, 
  iconHoverVariants, 
  prefersReducedMotion 
} from '@/animations/landingVariants';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      variants={prefersReducedMotion ? {} : featureCardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
      className="h-full"
    >
      <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="space-y-4">
          <motion.div
            variants={prefersReducedMotion ? {} : iconHoverVariants}
            initial="rest"
            whileHover="hover"
            className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center"
          >
            <Icon className="w-7 h-7 text-primary" />
          </motion.div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
