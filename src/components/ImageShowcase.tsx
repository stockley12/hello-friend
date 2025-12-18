import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const videos = [
  '/videos/showcase-hair.mp4',
  '/videos/showcase-6.mp4',
  '/videos/showcase-7.mp4',
  '/videos/showcase-8.mp4',
  '/videos/showcase-9.mp4',
  '/videos/showcase-11.mp4',
  '/videos/showcase-13.mp4',
  '/videos/showcase-14.mp4',
];

interface ImageShowcaseProps {
  direction?: 'left' | 'right';
  className?: string;
}

export function ImageShowcase({ direction = 'right', className = '' }: ImageShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 3500); // Change video every 3.5 seconds for faster transitions
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden ${className}`}>
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
      
      <div className="relative w-full h-full rounded-3xl overflow-hidden border border-primary/20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 200, damping: 25 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              ref={videoRef}
              src={videos[currentIndex]}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />

        {/* Progress dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {videos.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'bg-primary w-6' : 'bg-foreground/30 w-2'
              }`}
              animate={{ scale: i === currentIndex ? 1.2 : 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
