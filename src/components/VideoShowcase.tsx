import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Sparkles, Crown, Heart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

import showcase1 from '@/assets/showcase-1.jpg';
import showcase2 from '@/assets/showcase-2.jpg';
import showcase3 from '@/assets/showcase-3.jpg';
import showcase4 from '@/assets/showcase-4.jpg';

const showcaseData = [
  {
    video: '/videos/showcase-1.mp4',
    thumbnail: showcase1,
    title: 'Happy Client Moment',
    category: 'Transformation'
  },
  {
    video: '/videos/showcase-2.mp4',
    thumbnail: showcase2,
    title: 'Client Satisfaction',
    category: 'Style'
  },
  {
    video: '/videos/showcase-3.mp4',
    thumbnail: showcase3,
    title: 'Rainbow Yarn Magic',
    category: 'Creative'
  },
  {
    video: '/videos/showcase-4.mp4',
    thumbnail: showcase4,
    title: 'Crown Worthy',
    category: 'Braids'
  }
];

const galleryImages = [showcase1, showcase2, showcase3, showcase4];

export function VideoShowcase() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-rotate gallery images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleVideoClick = (index: number) => {
    if (activeVideo === index) {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    } else {
      setActiveVideo(index);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (activeVideo !== null && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [activeVideo]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
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
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <Play className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-bold tracking-wider uppercase">Video Showcase</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl md:text-5xl font-bold mb-4"
          >
            Watch Our <span className="text-gradient-gold">Magic</span> Happen
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-foreground/60 max-w-xl mx-auto"
          >
            Real transformations, real happiness. See what makes La'Couronne special.
          </motion.p>
        </motion.div>

        {/* Main Video Display */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          {/* Featured Video Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/20 aspect-[9/16] max-h-[500px] mx-auto bg-background/50">
              {/* Video/Thumbnail Container */}
              <AnimatePresence mode="wait">
                {activeVideo !== null ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <video
                      ref={videoRef}
                      src={showcaseData[activeVideo].video}
                      className="w-full h-full object-cover"
                      loop
                      muted={isMuted}
                      playsInline
                      onClick={() => handleVideoClick(activeVideo)}
                    />
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                      <div className="flex items-center justify-between">
                        <div>
                          <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-foreground font-bold"
                          >
                            {showcaseData[activeVideo].title}
                          </motion.p>
                          <span className="text-primary text-xs">{showcaseData[activeVideo].category}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleVideoClick(activeVideo)}
                            className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center"
                          >
                            {isPlaying ? (
                              <Pause className="w-5 h-5 text-primary" />
                            ) : (
                              <Play className="w-5 h-5 text-primary ml-0.5" />
                            )}
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMute}
                            className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center"
                          >
                            {isMuted ? (
                              <VolumeX className="w-5 h-5 text-primary" />
                            ) : (
                              <Volume2 className="w-5 h-5 text-primary" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-background"
                  >
                    {/* Rotating Image Showcase */}
                    <div className="relative w-48 h-48 mb-6">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentImageIndex}
                          src={galleryImages[currentImageIndex]}
                          alt="Showcase"
                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 w-full h-full object-cover rounded-2xl border-2 border-primary/40"
                        />
                      </AnimatePresence>
                      
                      {/* Decorative rings */}
                      <motion.div
                        className="absolute -inset-3 rounded-2xl border border-primary/20"
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute -inset-6 rounded-2xl border border-primary/10"
                        animate={{ rotate: [0, -5, 0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity }}
                      />
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <p className="text-foreground/60 mb-2">Select a video to watch</p>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-flex items-center gap-2 text-primary"
                      >
                        <Play className="w-5 h-5" />
                        <span className="font-semibold">Click below</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/40 rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/40 rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/40 rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/40 rounded-br-3xl" />
            </div>
          </motion.div>

          {/* Video Thumbnails Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {showcaseData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleVideoClick(index)}
                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                  activeVideo === index 
                    ? 'border-primary shadow-lg shadow-primary/30' 
                    : 'border-foreground/10 hover:border-primary/50'
                }`}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  activeVideo === index 
                    ? 'bg-primary/20' 
                    : 'bg-background/40 hover:bg-background/20'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        activeVideo === index 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-background/80 text-primary'
                      }`}
                    >
                      {activeVideo === index && isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </motion.div>
                  </div>
                  
                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/90 to-transparent">
                    <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                    <span className="text-[10px] text-primary">{item.category}</span>
                  </div>
                </div>
                
                {/* Active Indicator */}
                {activeVideo === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute top-2 right-2"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-primary"
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Stats/Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 mt-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm text-foreground/80">Happy Clients Daily</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground/80">Premium Quality</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-foreground/80">Creative Styles</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
