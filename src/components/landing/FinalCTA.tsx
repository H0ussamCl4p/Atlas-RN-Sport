/**
 * Final CTA Component
 * 
 * Large, prominent call-to-action section at the end of landing page.
 * Smooth entrance animation with scale and fade.
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { ctaCardVariants, prefersReducedMotion } from '@/animations/landingVariants';

export function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          variants={prefersReducedMotion ? {} : ctaCardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="relative overflow-hidden border-2">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
            
            {/* Content */}
            <div className="relative p-12 md:p-16 text-center space-y-8">
              <div className="space-y-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold leading-tight"
                >
                  Passez à l'analyse
                  <br />
                  <span className="text-primary">nouvelle génération</span>
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                  Rejoignez des centaines de clubs qui ont déjà transformé 
                  leur approche tactique avec Atlas.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.div
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                  whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                >
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 font-semibold group"
                    onClick={() => navigate('/register')}
                  >
                    Créer un compte
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                  whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 font-semibold"
                    onClick={() => navigate('/login')}
                  >
                    Se connecter
                  </Button>
                </motion.div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-sm text-muted-foreground"
              >
                Essai gratuit · Sans carte bancaire · Configuration en 2 minutes
              </motion.p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
