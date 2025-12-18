import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';
import gallery7 from '@/assets/gallery-7.jpg';
import gallery8 from '@/assets/gallery-8.jpg';

const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8];

interface ImageShowcaseProps {
  direction?: 'left' | 'right';
  className?: string;
}

export function ImageShowcase({ direction = 'right', className = '' }: ImageShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '-100%' : '100%',
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden ${className}`}>
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
      
      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-primary/20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Hair styling showcase"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
            }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />

        {/* Progress dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-primary w-6' : 'bg-foreground/30'
              }`}
              animate={{ scale: i === currentIndex ? 1.2 : 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
