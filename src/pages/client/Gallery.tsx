import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, Users, User, X, ChevronLeft, ChevronRight, Instagram, Camera } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';

// Import men's images (keeping these)
import menStyle1 from '@/assets/men-style-1.jpg';
import menStyle2 from '@/assets/men-style-2.jpg';
import menStyle3 from '@/assets/men-style-3.jpg';
import menStyle4 from '@/assets/men-style-4.jpg';
import menStyle5 from '@/assets/men-style-5.jpg';
import menStyle6 from '@/assets/men-style-6.jpg';

// Men's gallery data
const menGalleryData = [
  { id: 'm1', img: menStyle1, caption: 'Feed-In Braids', category: 'men' },
  { id: 'm2', img: menStyle2, caption: 'Stitch Braids', category: 'men' },
  { id: 'm3', img: menStyle3, caption: 'Box Braids', category: 'men' },
  { id: 'm4', img: menStyle4, caption: 'Zig-Zag Design', category: 'men' },
  { id: 'm5', img: menStyle5, caption: 'Star Pattern', category: 'men' },
  { id: 'm6', img: menStyle6, caption: 'Pop Smoke Style', category: 'men' },
];

// Women's placeholder data
const womenPlaceholders = [
  { id: 'w1', label: 'Women Style 1', category: 'women' },
  { id: 'w2', label: 'Women Style 2', category: 'women' },
  { id: 'w3', label: 'Women Style 3', category: 'women' },
  { id: 'w4', label: 'Women Style 4', category: 'women' },
  { id: 'w5', label: 'Women Style 5', category: 'women' },
  { id: 'w6', label: 'Women Style 6', category: 'women' },
  { id: 'w7', label: 'Women Style 7', category: 'women' },
];

export function Gallery() {
  const { settings } = useSalon();
  const [activeFilter, setActiveFilter] = useState<'all' | 'women' | 'men'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Combine men images with women placeholders for "all" view
  const displayItems = activeFilter === 'women' 
    ? womenPlaceholders 
    : activeFilter === 'men'
    ? menGalleryData
    : [...womenPlaceholders, ...menGalleryData];

  const openLightbox = (index: number) => {
    // Only open lightbox for men's images (which have actual images)
    if (activeFilter === 'men' || (activeFilter === 'all' && index >= womenPlaceholders.length)) {
      const actualIndex = activeFilter === 'all' ? index - womenPlaceholders.length : index;
      setLightboxIndex(actualIndex);
    }
  };
  
  const closeLightbox = () => setLightboxIndex(null);
  
  const nextImage = () => setLightboxIndex(prev => 
    prev !== null ? (prev + 1) % menGalleryData.length : null
  );
  
  const prevImage = () => setLightboxIndex(prev => 
    prev !== null ? (prev - 1 + menGalleryData.length) % menGalleryData.length : null
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/10" />
        
        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Floating sparkles */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 text-primary/40"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Our Work</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              <span className="text-foreground">Style</span>{' '}
              <span className="text-gradient-rose">Gallery</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our stunning hair transformations. 
              Every style is a work of art.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-6 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-lg z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-3">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('all')}
              className={`rounded-full px-6 h-11 ${activeFilter === 'all' ? 'btn-premium' : 'border-primary/30'}`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              All Styles
            </Button>
            <Button
              variant={activeFilter === 'women' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('women')}
              className={`rounded-full px-6 h-11 ${activeFilter === 'women' ? 'bg-primary' : 'border-primary/30'}`}
            >
              <Users className="w-4 h-4 mr-2" />
              Women
            </Button>
            <Button
              variant={activeFilter === 'men' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('men')}
              className={`rounded-full px-6 h-11 ${activeFilter === 'men' ? 'bg-blue-500' : 'border-blue-500/30 text-blue-500'}`}
            >
              <User className="w-4 h-4 mr-2" />
              Men
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {displayItems.map((item, index) => {
                const isPlaceholder = 'label' in item;
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -8 }}
                    onClick={() => !isPlaceholder && openLightbox(index)}
                    className={`group ${!isPlaceholder ? 'cursor-pointer' : ''}`}
                  >
                    <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                      isPlaceholder 
                        ? 'border-2 border-dashed border-primary/30 bg-card/50 hover:border-primary/50' 
                        : 'border-2 border-transparent hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20'
                    }`}>
                      {isPlaceholder ? (
                        // Placeholder for women's images
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-primary/40" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground text-center">{item.label}</p>
                          <p className="text-xs text-muted-foreground/60">Upload Image</p>
                        </div>
                      ) : (
                        // Actual image for men's styles
                        <>
                          <img
                            src={item.img}
                            alt={item.caption}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                          
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                          
                          {/* Category badge */}
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-blue-500/80 text-white">
                              👔 Men
                            </span>
                          </div>
                          
                          {/* Style name */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-bold text-lg leading-tight">
                              {item.caption}
                            </h3>
                            <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              BriBraidsBeauty
                            </p>
                          </div>
                          
                          {/* Hover shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Women's filter note */}
          {activeFilter === 'women' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground">
                Women's styles gallery coming soon! Follow us on Instagram for updates.
              </p>
              <a 
                href="https://instagram.com/bribraidsbeauty"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
              >
                <Instagram className="w-5 h-5" />
                @bribraidsbeauty
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center max-w-2xl mx-auto">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Styles Created</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">100%</p>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">5.0★</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              <span className="text-foreground">Ready for Your </span>
              <span className="text-gradient-rose">Transformation?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Book your appointment today and let us create your perfect look
            </p>
            <Button asChild size="lg" className="rounded-full px-10 h-14 text-lg btn-premium">
              <a href="/book">
                <Crown className="w-5 h-5 mr-2" />
                Book Now
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal - Only for men's images */}
      <AnimatePresence>
        {lightboxIndex !== null && menGalleryData[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={menGalleryData[lightboxIndex].img}
                alt={menGalleryData[lightboxIndex].caption}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              />
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <h3 className="text-white text-2xl font-bold">
                  {menGalleryData[lightboxIndex].caption}
                </h3>
                <p className="text-white/70 flex items-center gap-2 mt-1">
                  <Crown className="w-4 h-4 text-primary" />
                  BriBraidsBeauty
                </p>
              </div>
            </motion.div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm">
              {lightboxIndex + 1} / {menGalleryData.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
