import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import menStyle1 from '@/assets/men-style-1.jpg';
import menStyle2 from '@/assets/men-style-2.jpg';
import menStyle3 from '@/assets/men-style-3.jpg';
import menStyle4 from '@/assets/men-style-4.jpg';
import menStyle5 from '@/assets/men-style-5.jpg';
import menStyle6 from '@/assets/men-style-6.jpg';

const menImages = [
  menStyle1,
  menStyle2,
  menStyle3,
  menStyle4,
  menStyle5,
  menStyle6,
];

interface MenImageShowcaseProps {
  direction?: 'left' | 'right';
  className?: string;
}

export function MenImageShowcase({ direction = 'left', className = '' }: MenImageShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % menImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1,
      rotateY: dir === 'right' ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '-100%' : '100%',
      opacity: 0,
      scale: 0.9,
      rotateY: dir === 'right' ? -15 : 15,
    }),
  };

  return (
    <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden ${className}`}>
      {/* Animated glow effect */}
      <motion.div 
        className="absolute -inset-4 bg-primary/30 blur-3xl rounded-full"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Rotating border accent */}
      <motion.div
        className="absolute -inset-1 rounded-3xl"
        style={{
          background: 'conic-gradient(from 0deg, hsl(var(--primary)), transparent, hsl(var(--primary)))',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-primary/30 bg-background">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 150, damping: 20 },
              opacity: { duration: 0.6 },
              scale: { duration: 0.6 },
              rotateY: { duration: 0.6 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Ken Burns effect on images */}
            <motion.img
              src={menImages[currentIndex]}
              alt="Men's grooming style"
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 pointer-events-none" />

        {/* Animated corner accents */}
        <motion.div 
          className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-primary/50 rounded-tl-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-primary/50 rounded-tr-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div 
          className="absolute bottom-16 left-4 w-12 h-12 border-l-2 border-b-2 border-primary/50 rounded-bl-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-16 right-4 w-12 h-12 border-r-2 border-b-2 border-primary/50 rounded-br-lg"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />

        {/* Progress bar */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2">
            {menImages.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="flex-1 h-1 rounded-full overflow-hidden bg-foreground/20"
              >
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: i === currentIndex ? '100%' : i < currentIndex ? '100%' : '0%'
                  }}
                  transition={{ 
                    duration: i === currentIndex ? 4 : 0.3,
                    ease: i === currentIndex ? 'linear' : 'easeOut'
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
