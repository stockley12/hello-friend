import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Crown, Sparkles, User, Users, Clock, ChevronRight, Star, ShoppingBag, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { haptics } from '@/lib/haptics';
import { useSalon } from '@/contexts/SalonContext';
import { ImageShowcase } from '@/components/ImageShowcase';

// Import men's images (keeping these)
import menStyle1 from '@/assets/men-style-1.jpg';
import menStyle2 from '@/assets/men-style-2.jpg';
import menStyle3 from '@/assets/men-style-3.jpg';

const menShowcaseImages = [
  { img: menStyle1, title: 'Sharp Cornrows', quote: '"Looking fresh!"' },
  { img: menStyle2, title: 'Clean Lines', quote: '"Best in ATL!"' },
  { img: menStyle3, title: 'Bold Design', quote: '"Exactly what I wanted!"' },
];

// Women's placeholder showcase
const womenPlaceholders = [
  { id: 1, label: 'Women Style 1' },
  { id: 2, label: 'Women Style 2' },
  { id: 3, label: 'Women Style 3' },
  { id: 4, label: 'Women Style 4' },
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
  products: '🛍️ Products',
};

// Sample services with USD pricing
const sampleWomenServices = [
  { id: 'w1', name: 'Knotless Braids', price: 250, duration: 240, category: 'braids' },
  { id: 'w2', name: 'Box Braids', price: 180, duration: 180, category: 'braids' },
  { id: 'w3', name: 'Goddess Locs', price: 280, duration: 300, category: 'locs' },
  { id: 'w4', name: 'Passion Twists', price: 175, duration: 180, category: 'twists' },
  { id: 'w5', name: 'Sew-In Weave', price: 200, duration: 120, category: 'styling' },
  { id: 'w6', name: 'Wig Install', price: 85, duration: 60, category: 'styling' },
];

const sampleMenServices = [
  { id: 'm1', name: 'Cornrows', price: 75, duration: 90, category: 'braids' },
  { id: 'm2', name: 'Two-Strand Twists', price: 100, duration: 120, category: 'twists' },
  { id: 'm3', name: 'Locs', price: 150, duration: 180, category: 'locs' },
  { id: 'm4', name: 'Box Braids', price: 120, duration: 150, category: 'braids' },
];

const sampleProducts = [
  { id: 'p1', name: 'Hair Bundles', price: 85, category: 'products', description: 'Premium human hair' },
  { id: 'p2', name: 'HD Lace Wigs', price: 150, category: 'products', description: 'Natural looking wigs' },
  { id: 'p3', name: 'Closures/Frontals', price: 65, category: 'products', description: 'Perfect finishing' },
  { id: 'p4', name: 'Accessories', price: 15, category: 'products', description: 'Hair accessories' },
];

const formatPrice = (price: number) => `$${price.toLocaleString()}`;

export function Services() {
  const { services } = useSalon();
  const [selectedGender, setSelectedGender] = useState<'female' | 'male' | null>(null);
  
  // Use sample services for display (keeping backend functionality intact)
  const displayServices = selectedGender === 'female' ? sampleWomenServices : sampleMenServices;

  const handleGenderSelect = (gender: 'female' | 'male') => {
    haptics.medium();
    setSelectedGender(gender);
  };

  return (
    <div className="min-h-[100dvh] bg-background overflow-hidden">
      {/* Hero Section - New Design */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        
        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
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
              <span className="text-gradient-rose">Services & Products</span>
            </h1>
            
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              Premium hair styling for men & women, plus quality hair products. Atlanta's trusted hair destination.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gender Selection - New Design */}
      <section className="py-8 md:py-12 border-b border-border sticky top-16 md:top-20 bg-background/95 backdrop-blur-lg z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 md:gap-6">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenderSelect('female')}
              className={`flex flex-col items-center gap-2 p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 min-w-[140px] md:min-w-[180px] ${
                selectedGender === 'female'
                  ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                  : 'border-border hover:border-primary/50 bg-card/50'
              }`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${
                selectedGender === 'female' ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'
              }`}>
                <Users className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <span className={`font-bold text-lg ${selectedGender === 'female' ? 'text-primary' : 'text-foreground'}`}>
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

      {/* Showcase Section */}
      <AnimatePresence>
        {selectedGender && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-8 md:py-12 bg-gradient-to-b from-background to-primary/5"
          >
            <div className="container mx-auto px-4">
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

                {/* Image Grid */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="order-1 md:order-2 grid grid-cols-2 gap-3"
                >
                  {selectedGender === 'female' ? (
                    // Women's Placeholders
                    womenPlaceholders.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="aspect-square rounded-xl border-2 border-dashed border-primary/30 bg-card/50 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors"
                      >
                        <Crown className="w-8 h-8 text-primary/40" />
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                      </motion.div>
                    ))
                  ) : (
                    // Men's actual images
                    menShowcaseImages.slice(0, 4).map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative group rounded-xl overflow-hidden aspect-square border-2 border-blue-500/20 shadow-lg"
                      >
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2">
                          <p className="text-white text-sm font-semibold">{item.title}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </div>
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
                    {displayServices.length} services available
                  </p>
                </div>

                {/* Services Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                  {displayServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => haptics.light()}
                      className={`group p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                        selectedGender === 'female'
                          ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10'
                          : 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {service.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {categoryLabels[service.category] || service.category}
                          </p>
                          <div className="flex items-center gap-4 mt-4">
                            <span className={`text-xl font-bold ${
                              selectedGender === 'female' ? 'text-primary' : 'text-blue-500'
                            }`}>
                              {formatPrice(service.price)}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {service.duration} min
                            </span>
                          </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                          selectedGender === 'female' ? 'text-primary' : 'text-blue-500'
                        }`} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Book CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center pt-6"
                >
                  <Link to="/book">
                    <Button size="lg" className={`rounded-full px-10 h-14 text-lg ${
                      selectedGender === 'female' 
                        ? 'btn-premium' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}>
                      <Crown className="w-5 h-5 mr-2" />
                      Book Appointment
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-wider">Shop</span>
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Premium </span>
              <span className="text-gradient-rose">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Quality human hair bundles, wigs, closures, frontals, and accessories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {sampleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-5 rounded-2xl text-center border border-primary/10 hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Gem className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{product.description}</p>
                <p className="text-primary font-bold">From {formatPrice(product.price)}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/contact">
              <Button variant="outline" className="rounded-full px-8 h-12 border-primary/30 hover:bg-primary/10">
                Contact for Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center max-w-2xl mx-auto">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Happy Clients</p>
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
    </div>
  );
}
