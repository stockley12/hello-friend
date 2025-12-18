import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after a short delay for better UX
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-md pointer-events-auto">
              {/* Animated background glow */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute -inset-4 bg-gradient-to-r from-primary via-amber-400 to-primary rounded-3xl opacity-30 blur-2xl"
              />
              
              {/* Main card */}
              <div className="relative bg-gradient-to-br from-background via-background to-primary/10 rounded-3xl border border-primary/30 overflow-hidden shadow-2xl">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-foreground/70" />
                </button>
                
                {/* Decorative top pattern */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/20 to-transparent" />
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 left-1/2 -translate-x-1/2"
                >
                  <div className="relative">
                    <Crown className="w-16 h-16 text-primary" />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-primary/30 rounded-full blur-xl"
                    />
                  </div>
                </motion.div>
                
                {/* Content */}
                <div className="relative pt-28 pb-8 px-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-primary text-xs font-bold tracking-[0.2em] uppercase">
                        Welcome
                      </span>
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                      Ready to Look{' '}
                      <span className="text-gradient-gold">Amazing?</span>
                    </h2>
                    
                    <p className="text-foreground/70 mb-6 leading-relaxed">
                      Your crown deserves royal treatment. 
                      Starting from just <span className="text-primary font-bold">₺1,500</span>, 
                      walk out feeling like royalty.
                    </p>
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [-20, -100],
                            x: [0, Math.random() * 40 - 20],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeOut"
                          }}
                          className="absolute bottom-0 w-2 h-2 bg-primary/60 rounded-full"
                          style={{ left: `${15 + i * 15}%` }}
                        />
                      ))}
                    </div>
                    
                    <Link to="/book" onClick={handleClose}>
                      <Button 
                        size="lg" 
                        className="btn-premium rounded-full px-10 font-bold text-lg h-14 w-full"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Book Your Glow Up
                      </Button>
                    </Link>
                    
                    <button 
                      onClick={handleClose}
                      className="mt-4 text-sm text-foreground/50 hover:text-foreground/70 transition-colors"
                    >
                      Maybe later
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
