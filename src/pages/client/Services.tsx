import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Crown, Sparkles, User, Users, Clock, ChevronRight, Heart, Star, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { haptics } from '@/lib/haptics';
import { useSalon } from '@/contexts/SalonContext';
import { ImageShowcase } from '@/components/ImageShowcase';

import servicesHeroBg from '@/assets/services-hero-bg.jpg';

// Import showcase images for happy moments
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import menStyle1 from '@/assets/men-style-1.jpg';
import menStyle2 from '@/assets/men-style-2.jpg';
import menStyle3 from '@/assets/men-style-3.jpg';

const womenShowcaseImages = [
  { img: gallery1, title: 'Beautiful Braids', quote: '"I feel like a queen!"' },
  { img: gallery2, title: 'Stunning Twists', quote: '"Best salon ever!"' },
  { img: gallery3, title: 'Natural Glow', quote: '"Absolutely love it!"' },
  { img: gallery4, title: 'Elegant Style', quote: '"So happy with my hair!"' },
  { img: gallery5, title: 'Crown Ready', quote: '"Feeling beautiful!"' },
];

const menShowcaseImages = [
  { img: menStyle1, title: 'Sharp Cornrows', quote: '"Looking fresh!"' },
  { img: menStyle2, title: 'Clean Lines', quote: '"Best barber in town!"' },
  { img: menStyle3, title: 'Bold Design', quote: '"Exactly what I wanted!"' },
];

// Category display names
const categoryLabels: Record<string, string> = {
  braids: '✨ Braids',
  twists: '🌀 Twists',
  locs: '🔥 Locs',
  natural: '🌿 Natural Hair',
  treatment: '💆 Treatments',
  styling: '💫 Styling',
  extensions: '✂️ Extensions',
  color: '🎨 Color',
  mens: '👔 Men\'s Styles',
  cut: '💈 Cuts & Fades',
};

// All possible categories
const allCategories = ['braids', 'twists', 'locs', 'natural', 'treatment', 'styling', 'extensions', 'color', 'mens', 'cut'];

export function Services() {
  const { services } = useSalon();
  const [selectedGender, setSelectedGender] = useState<'female' | 'male'>(() => {
    const saved = localStorage.getItem('preferredGender');
    return (saved === 'male' || saved === 'female') ? saved : 'female';
  });
  
  // Filter services by gender field
  const filteredServices = services.filter(s => {
    if (!s.active) return false;
    if (!selectedGender) return true;
    // Show if service gender matches selection, or if service is for 'both'
    if (s.gender === 'both') return true;
    return s.gender === selectedGender;
  });

  // Group services by category
  const groupedServices = allCategories.reduce((acc, category) => {
    const categoryServices = filteredServices.filter(s => s.category === category);
    if (categoryServices.length > 0) {
      acc[category] = categoryServices;
    }
    return acc;
  }, {} as Record<string, typeof filteredServices>);

  const handleGenderSelect = (gender: 'female' | 'male') => {
    haptics.medium();
    setSelectedGender(gender);
    localStorage.setItem('preferredGender', gender);
  };

  return (
    <div className="min-h-[100dvh] bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${servicesHeroBg})` }}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary/30 mb-6"
            >
              <Crown className="w-8 h-8 text-primary" />
            </motion.div>
            
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Our </span>
              <span className="text-gradient-gold">Services</span>
            </h1>
            
            <p className="text-foreground/60 text-base md:text-lg max-w-xl mx-auto">
              Premium hair styling for every crown. Select your preference to view our curated services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gender Selection */}
      <section className="py-8 md:py-12 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-lg z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 md:gap-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenderSelect('female')}
              className={`flex flex-col items-center gap-2 p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 min-w-[140px] md:min-w-[180px] ${
                selectedGender === 'female'
                  ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20'
                  : 'border-border hover:border-pink-500/50 bg-card/50'
              }`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${
                selectedGender === 'female' ? 'bg-pink-500 text-white' : 'bg-pink-500/20 text-pink-500'
              }`}>
                <Users className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <span className={`font-bold text-lg ${selectedGender === 'female' ? 'text-pink-500' : 'text-foreground'}`}>
                Women
              </span>
              <span className="text-xs text-muted-foreground">👑 Queen Services</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenderSelect('male')}
              className={`flex flex-col items-center gap-2 p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 min-w-[140px] md:min-w-[180px] ${
                selectedGender === 'male'
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-border hover:border-blue-500/50 bg-card/50'
              }`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${
                selectedGender === 'male' ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-500'
              }`}>
                <User className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <span className={`font-bold text-lg ${selectedGender === 'male' ? 'text-blue-500' : 'text-foreground'}`}>
                Men
              </span>
              <span className="text-xs text-muted-foreground">👔 King Services</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* Happy Moments Showcase - Only show when gender is selected */}
      <AnimatePresence>
        {selectedGender && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-8 md:py-12 bg-gradient-to-b from-background to-primary/5"
          >
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 md:mb-8"
              >
                <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Smile className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-bold uppercase tracking-wider">Happy Moments</span>
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                  {selectedGender === 'female' ? '👑 Queens Showcase' : '👔 Kings Showcase'}
                </h2>
                <p className="text-foreground/60 text-sm md:text-base">
                  See the joy in every transformation
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center max-w-5xl mx-auto">
                {/* Video Showcase */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="order-2 md:order-1"
                >
                  <ImageShowcase category={selectedGender === 'female' ? 'women' : 'men'} />
                </motion.div>

                {/* Image Gallery Grid */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="order-1 md:order-2 grid grid-cols-2 gap-3"
                >
                  {(selectedGender === 'female' ? womenShowcaseImages : menShowcaseImages).slice(0, 4).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="relative group rounded-xl overflow-hidden aspect-square border-2 border-primary/20 shadow-lg"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-bold">{item.title}</p>
                        <p className="text-primary text-xs italic">{item.quote}</p>
                      </div>
                      {/* Stars overlay */}
                      <motion.div
                        className="absolute top-2 right-2 flex gap-0.5"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                        ))}
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Happy client tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-3 mt-6"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                  <span className="text-green-500 text-sm font-medium">✨ 200+ Happy Clients in North Cyprus</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
                  <span className="text-primary text-sm font-medium">⭐ 5-Star Reviews</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30">
                  <span className="text-pink-500 text-sm font-medium">💖 100% Satisfaction</span>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Services Display */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {!selectedGender ? (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary/50" />
                <h3 className="text-2xl font-bold mb-2">Select Your Preference</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose "Women" or "Men" above to see our curated services designed specifically for you.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedGender}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                {/* Header */}
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {selectedGender === 'female' ? '👑 Services for Queens' : '👔 Services for Kings'}
                  </h2>
                  <p className="text-muted-foreground">
                    {Object.keys(groupedServices).length} categories • {filteredServices.length} services available
                  </p>
                  
                  {/* Men's Video Coming Soon Alert */}
                  {selectedGender === 'male' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30"
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 text-sm font-medium">
                        Videos for our men's hair styles coming soon!
                      </span>
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </motion.div>
                  )}
                </div>

                {/* Services by Category */}
                {Object.entries(groupedServices).map(([category, categoryServices], categoryIndex) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      {categoryLabels[category] || category}
                      <span className="text-sm font-normal text-muted-foreground">
                        ({categoryServices.length})
                      </span>
                    </h3>
                    
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {categoryServices.map((service, index) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => haptics.light()}
                          className={`group p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                            selectedGender === 'female'
                              ? 'bg-gradient-to-br from-pink-500/5 to-purple-500/5 border-pink-500/20 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10'
                              : 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                {service.name}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {service.description}
                              </p>
                              <div className="flex items-center gap-3 mt-3">
                                <span className={`text-lg font-bold ${
                                  selectedGender === 'female' ? 'text-pink-500' : 'text-blue-500'
                                }`}>
                                  ₺{service.price.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {service.durationMin >= 60 
                                    ? `${Math.floor(service.durationMin / 60)}h ${service.durationMin % 60 > 0 ? `${service.durationMin % 60}m` : ''}`
                                    : `${service.durationMin}m`
                                  }
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Book Now CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center pt-8"
                >
                  <Link to="/book" onClick={() => haptics.heavy()}>
                    <Button 
                      size="lg" 
                      className={`rounded-full px-10 h-14 font-bold text-lg shadow-lg ${
                        selectedGender === 'female'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-pink-500/25'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-blue-500/25'
                      }`}
                    >
                      Book Your Appointment
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>


      {/* Bottom CTA for non-selected state */}
      {!selectedGender && (
        <section className="py-16 bg-gradient-to-t from-primary/10 to-transparent">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to <span className="text-gradient-gold">Transform?</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Select your preference above to explore our premium services.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
