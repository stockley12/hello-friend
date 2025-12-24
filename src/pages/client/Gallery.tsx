import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, Users, User, X, ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';

export function Gallery() {
  const { galleryImages, settings } = useSalon();
  const [activeFilter, setActiveFilter] = useState<'all' | 'women' | 'men'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter images based on category
  const filteredImages = activeFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex(prev => 
    prev !== null ? (prev + 1) % filteredImages.length : null
  );
  const prevImage = () => setLightboxIndex(prev => 
    prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-amber-900/20" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
        
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
              <span className="text-primary">Gallery</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of stunning hair transformations. 
              Every style tells a story of confidence and beauty.
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
              className="rounded-full px-6 h-11"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              All Styles
            </Button>
            <Button
              variant={activeFilter === 'women' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('women')}
              className="rounded-full px-6 h-11"
            >
              <Users className="w-4 h-4 mr-2" />
              Women
            </Button>
            <Button
              variant={activeFilter === 'men' ? 'default' : 'outline'}
              onClick={() => setActiveFilter('men')}
              className="rounded-full px-6 h-11"
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
          {filteredImages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary/50" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Coming Soon!</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're preparing an amazing collection of our latest hair styles. 
                Check back soon to see our work!
              </p>
              <a 
                href={`https://instagram.com/${settings.instagramHandle?.replace('@', '') || 'lacouronne'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 text-primary hover:underline"
              >
                <Instagram className="w-5 h-5" />
                Follow us on Instagram for updates
              </a>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => openLightbox(index)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted border-2 border-transparent hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/20">
                      {/* Image */}
                      <img
                        src={image.url}
                        alt={image.caption || 'Hair style'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x500?text=Image+Not+Found';
                        }}
                      />
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                          image.category === 'women' 
                            ? 'bg-pink-500/80 text-white' 
                            : 'bg-blue-500/80 text-white'
                        }`}>
                          {image.category === 'women' ? '👑 Women' : '👔 Men'}
                        </span>
                      </div>
                      
                      {/* Style name */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-lg md:text-xl leading-tight">
                          {image.caption || 'Beautiful Style'}
                        </h3>
                        <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          La'Couronne
                        </p>
                      </div>
                      
                      {/* Hover shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {filteredImages.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-primary/10 via-background to-amber-500/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 gap-4 text-center max-w-2xl mx-auto">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">{galleryImages.length}+</p>
                <p className="text-sm text-muted-foreground">Styles</p>
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
      )}

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
              Ready for Your Transformation?
            </h2>
            <p className="text-muted-foreground mb-8">
              Book your appointment today and let us create your perfect look
            </p>
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg">
              <a href="/book">
                <Crown className="w-5 h-5 mr-2" />
                Book Now
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
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
            {filteredImages.length > 1 && (
              <>
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
              </>
            )}

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
                src={filteredImages[lightboxIndex].url}
                alt={filteredImages[lightboxIndex].caption || 'Hair style'}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              />
              
              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <h3 className="text-white text-2xl font-bold">
                  {filteredImages[lightboxIndex].caption || 'Beautiful Style'}
                </h3>
                <p className="text-white/70 flex items-center gap-2 mt-1">
                  <Crown className="w-4 h-4 text-primary" />
                  La'Couronne Hair Studio
                </p>
              </div>
            </motion.div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm">
              {lightboxIndex + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


