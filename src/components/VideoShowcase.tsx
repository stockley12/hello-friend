import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, Heart, Star, Smile } from 'lucide-react';
import { useState, useEffect } from 'react';

import showcase1 from '@/assets/showcase-1.jpg';
import showcase2 from '@/assets/showcase-2.jpg';
import showcase3 from '@/assets/showcase-3.jpg';
import showcase4 from '@/assets/showcase-4.jpg';

const showcaseData = [
  {
    image: showcase1,
    title: 'Rainbow Magic',
    quote: '"I love my new look!"',
    mood: 'Creative & Bold'
  },
  {
    image: showcase2,
    title: 'Classic Elegance',
    quote: '"Exactly what I wanted!"',
    mood: 'Sleek & Professional'
  },
  {
    image: showcase3,
    title: 'Fire Red Vibes',
    quote: '"Feeling like a queen!"',
    mood: 'Bold & Beautiful'
  },
  {
    image: showcase4,
    title: 'Lemonade Braids',
    quote: '"Absolutely stunning!"',
    mood: 'Elegant & Chic'
  }
];

// Floating hearts animation
const FloatingEmoji = ({ delay, emoji }: { delay: number; emoji: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, x: Math.random() * 100 - 50 }}
    animate={{ 
      opacity: [0, 1, 1, 0], 
      y: -100,
      x: Math.random() * 60 - 30
    }}
    transition={{ 
      duration: 3, 
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 2
    }}
    className="absolute text-2xl"
    style={{ left: `${Math.random() * 80 + 10}%`, bottom: '20%' }}
  >
    {emoji}
  </motion.div>
);

export function VideoShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Auto-rotate through images
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % showcaseData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -45 : 45,
      transition: {
        duration: 0.6
      }
    })
  };

  return (
    <section className="py-6 md:py-10 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-0 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
          animate={{ x: [-50, 50, -50], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{ x: [50, -50, 50], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/5 to-transparent blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-3 md:px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4 md:mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 md:gap-2 mb-2 md:mb-4 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <Smile className="w-3 md:w-4 h-3 md:h-4 text-primary" />
            <span className="text-primary text-xs md:text-sm font-bold tracking-wider uppercase">Happy Moments</span>
            <Heart className="w-3 md:w-4 h-3 md:h-4 text-red-500" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-xl md:text-4xl font-bold mb-2 md:mb-4"
          >
            Smiles That <span className="text-gradient-gold">Speak</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-foreground/60 max-w-xl mx-auto text-sm md:text-base px-2"
          >
            See the joy in every transformation.
          </motion.p>
        </motion.div>

        {/* Main Showcase Display */}
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-4 md:gap-8 items-center">
            
            {/* Main Image Carousel */}
            <div className="relative">
              <div className="relative aspect-[3/4] max-w-sm mx-auto" style={{ perspective: '1000px' }}>
                {/* Decorative Frame */}
                <motion.div
                  className="absolute -inset-3 rounded-3xl border-2 border-primary/20"
                  animate={{ rotate: [2, -2, 2] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -inset-6 rounded-3xl border border-primary/10"
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                
                {/* Main Image */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-primary/40 shadow-2xl shadow-primary/20">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={activeIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="absolute inset-0"
                    >
                      <img
                        src={showcaseData[activeIndex].image}
                        alt={showcaseData[activeIndex].title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                      
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Floating Emojis */}
                  <FloatingEmoji delay={0} emoji="❤️" />
                  <FloatingEmoji delay={0.5} emoji="✨" />
                  <FloatingEmoji delay={1} emoji="💕" />
                  <FloatingEmoji delay={1.5} emoji="🌟" />
                  <FloatingEmoji delay={2} emoji="💖" />
                  
                  {/* Quote Overlay */}
                  <motion.div
                    key={`quote-${activeIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 p-5"
                  >
                    <motion.p
                      className="text-foreground text-xl font-display font-bold italic"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {showcaseData[activeIndex].quote}
                    </motion.p>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                        >
                          <Star className="w-4 h-4 fill-primary text-primary" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Joy Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.4 }}
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1"
                  >
                    <Smile className="w-3 h-3" />
                    Happy Client
                  </motion.div>
                </div>
                
                {/* Pulse Ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-primary/40"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Right Side - Info Cards */}
            <div className="space-y-4">
              {showcaseData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                  }}
                  className={`relative cursor-pointer group transition-all duration-300 ${
                    activeIndex === index ? 'scale-105' : 'hover:scale-102'
                  }`}
                >
                  <motion.div
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                      activeIndex === index
                        ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20'
                        : 'bg-foreground/5 border-foreground/10 hover:border-primary/30 hover:bg-primary/5'
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {activeIndex === index && (
                        <motion.div
                          className="absolute inset-0 bg-primary/20"
                          animate={{ opacity: [0.2, 0.4, 0.2] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-foreground truncate">{item.title}</h4>
                      <p className="text-sm text-primary">{item.mood}</p>
                      <p className="text-xs text-foreground/60 italic mt-1 truncate">{item.quote}</p>
                    </div>
                    
                    {/* Active Indicator */}
                    {activeIndex === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex-shrink-0"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Connection Line */}
                  {activeIndex === index && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-8 h-0.5 bg-gradient-to-l from-primary to-transparent origin-right hidden lg:block"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          {showcaseData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className="relative"
            >
              <motion.div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-primary' : 'bg-foreground/20 hover:bg-foreground/40'
                }`}
                animate={activeIndex === index ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5 }}
              />
              {activeIndex === index && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Bottom Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.div>
            <span className="text-sm text-foreground/80">100% Client Satisfaction</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">Premium Experience</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-foreground/80">Beautiful Results</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
