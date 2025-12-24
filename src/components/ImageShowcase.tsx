import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';

// Fallback videos when no gallery videos exist
const fallbackWomenVideos = [
  '/videos/women-priority.mp4',
  '/videos/women-1.mp4',
  '/videos/women-2.mp4',
  '/videos/women-3.mp4',
  '/videos/women-4.mp4',
  '/videos/showcase-hair.mp4',
  '/videos/showcase-6.mp4',
];

const fallbackMenVideos = [
  '/videos/women-priority.mp4',
  '/videos/women-1.mp4',
  '/videos/women-2.mp4',
  '/videos/women-3.mp4',
  '/videos/women-4.mp4',
  '/videos/showcase-hair.mp4',
];

interface ImageShowcaseProps {
  direction?: 'left' | 'right';
  className?: string;
  category?: 'women' | 'men';
}

export function ImageShowcase({ direction = 'right', className = '', category = 'women' }: ImageShowcaseProps) {
  const { galleryImages } = useSalon();
  
  // Get videos from gallery for this category
  const categoryVideos = galleryImages
    .filter(item => item.category === category && item.mediaType === 'video')
    .map(item => item.url);
  
  // Use gallery videos if available, otherwise use fallbacks
  const videoList = categoryVideos.length > 0 
    ? categoryVideos 
    : (category === 'men' ? fallbackMenVideos : fallbackWomenVideos);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset index when video list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [category, categoryVideos.length]);

  // Swipe handlers
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setCurrentIndex((prev) => (prev + 1) % videoList.length);
    } else if (info.offset.x > swipeThreshold) {
      setCurrentIndex((prev) => (prev - 1 + videoList.length) % videoList.length);
    }
  }, [videoList.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % videoList.length);
  }, [videoList.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + videoList.length) % videoList.length);
  }, [videoList.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videoList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [videoList.length]);

  const slideVariants = {
    enter: {
      opacity: 0,
      scale: 1.2,
      filter: 'blur(10px)',
    },
    center: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)',
    },
  };

  return (
    <div className={`relative aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden ${className}`}>
      {/* Animated glow effect */}
      <motion.div 
        className="absolute -inset-4 bg-primary/30 blur-3xl rounded-full"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Navigation Arrows - Mobile optimized touch targets */}
      <button
        onClick={goToPrev}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm border border-primary/30 active:scale-95 transition-transform touch-manipulation"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-primary" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm border border-primary/30 active:scale-95 transition-transform touch-manipulation"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-primary" />
      </button>
      
      <motion.div 
        className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden border border-primary/30 shadow-2xl shadow-primary/20 touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 1.2,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Ken Burns effect on video */}
            <motion.video
              ref={videoRef}
              src={videoList[currentIndex]}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover pointer-events-none"
              initial={{ scale: 1 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 8, ease: "linear" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Beautiful overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent pointer-events-none" />
        
        {/* Shimmer effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut",
          }}
        />

        {/* Animated progress bar - larger touch targets */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3">
          {videoList.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="h-8 flex items-center touch-manipulation"
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to video ${i + 1}`}
            >
              <div className="h-1.5 rounded-full overflow-hidden bg-foreground/20 backdrop-blur-sm min-w-[24px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: i === currentIndex ? '100%' : i < currentIndex ? '100%' : '0%'
                  }}
                  transition={{ 
                    duration: i === currentIndex ? 8 : 0.3,
                    ease: i === currentIndex ? 'linear' : 'easeOut'
                  }}
                />
              </div>
            </motion.button>
          ))}
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-primary/50 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-primary/50 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-14 left-3 w-6 h-6 border-l-2 border-b-2 border-primary/50 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-14 right-3 w-6 h-6 border-r-2 border-b-2 border-primary/50 rounded-br-lg pointer-events-none" />
      </motion.div>
    </div>
  );
}
