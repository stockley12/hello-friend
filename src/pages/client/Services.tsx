import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Crown, Sparkles, User, Users, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { haptics } from '@/lib/haptics';
import { useSalon } from '@/contexts/SalonContext';
import servicesHeroBg from '@/assets/services-hero-bg.jpg';

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
  const [selectedGender, setSelectedGender] = useState<'female' | 'male' | null>(null);
  
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
