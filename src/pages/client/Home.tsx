import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, MapPin, Phone, Instagram, Crown, Scissors, Star, Home as HomeIcon, Palette, Users, Clock, CheckCircle2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { VideoShowcase } from '@/components/VideoShowcase';

import { useEffect, useState, useMemo } from 'react';

// Import your images
import heroImage from '@/assets/hero-image.jpeg';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';
import gallery7 from '@/assets/gallery-7.jpg';
import gallery8 from '@/assets/gallery-8.jpg';
import menStyle1 from '@/assets/men-style-1.jpg';
import menStyle2 from '@/assets/men-style-2.jpg';
import menStyle3 from '@/assets/men-style-3.jpg';
import menStyle4 from '@/assets/men-style-4.jpg';
import menStyle5 from '@/assets/men-style-5.jpg';
import menStyle6 from '@/assets/men-style-6.jpg';

const galleryData = [
  { img: gallery1, category: 'women', style: 'Knotless Braids', featured: true },
  { img: gallery7, category: 'men', style: 'Cornrow Art', featured: true },
];

const menGalleryData = [
  { img: menStyle1, style: 'Feed-In Braids', highlight: 'Gold Accents' },
  { img: menStyle2, style: 'Stitch Braids', highlight: 'Clean Lines' },
  { img: menStyle3, style: 'Box Braids', highlight: 'Freestyle' },
  { img: menStyle4, style: 'Zig-Zag Design', highlight: 'Geometric' },
  { img: menStyle5, style: 'Star Pattern', highlight: 'Artistic' },
  { img: menStyle6, style: 'Pop Smoke', highlight: 'Iconic' },
];

const formatPrice = (price: number) => `₺${price.toLocaleString('tr-TR')}`;

const locations = ['Mağusa', 'Lefke', 'Lefkoşa'];

// Typewriter effect component
const TypewriterText = ({ texts, speed = 100 }: { texts: string[]; speed?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed]);

  return (
    <span className="text-black font-bold">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="text-black"
      >
        |
      </motion.span>
    </span>
  );
};

// Animated number typing effect
const AnimatedTypingNumber = ({ numbers }: { numbers: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentNumber = numbers[currentIndex];
    
    if (isTyping) {
      if (displayText.length < currentNumber.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentNumber.slice(0, displayText.length + 1));
        }, 150);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2500);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        setCurrentIndex((prev) => (prev + 1) % numbers.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, currentIndex, numbers]);

  return (
    <span className="font-mono">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.4, repeat: Infinity }}
        className="text-primary ml-0.5"
      >
        _
      </motion.span>
    </span>
  );
};

export function Home() {
  const { services, settings } = useSalon();
  const [activeLocation, setActiveLocation] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % menGalleryData.length : null);
  const prevImage = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + menGalleryData.length) % menGalleryData.length : null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  // Rotate through locations - Mağusa first
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLocation(prev => (prev + 1) % locations.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  
  const signatureServices = services.filter(s => s.active).slice(0, 4);

  const typewriterTexts = useMemo(() => [
    'Premium Hair Artistry',
    'Home Services Available',
    'Hair Treatment & Care',
    'Men & Women Styling'
  ], []);

  const typingNumbers = useMemo(() => ['100+', '100%', '24/7', '5.0★'], []);
  
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Cursor Glow Effect */}
      <motion.div
        className="cursor-glow hidden md:block"
        style={{ x: smoothMouseX, y: smoothMouseY }}
      />
      
      {/* Hero Section */}
      <section 
        className="relative py-6 md:py-12 lg:py-16 overflow-hidden min-h-[55vh] md:min-h-[60vh]"
        style={{
          backgroundImage: `url('./home-hero-bg.png?v=3')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container mx-auto px-3 md:px-4 relative z-10">
          {/* Top Location Bar - Hidden on mobile, shown on tablet+ */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex absolute top-4 left-1/2 -translate-x-1/2 flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-black/10">
              <MapPin className="w-4 h-4 text-black" />
              <span className="text-sm font-medium text-black">North Cyprus</span>
              <span className="text-black font-bold">•</span>
              <motion.span
                key={activeLocation}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-black font-semibold"
              >
                {locations[activeLocation]}
              </motion.span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-black/10">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-primary text-primary" />
              ))}
            </div>
          </motion.div>

          {/* Hero Service Tags - Responsive positioning */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute left-3 md:left-4 top-4 md:top-12 flex flex-wrap gap-1.5 md:gap-2 max-w-[140px] md:max-w-none"
          >
            {['Hair Treatment', 'Braids', 'Locs'].map((style, i) => (
              <motion.span
                key={style}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className="px-2 md:px-4 py-0.5 md:py-1.5 text-[9px] md:text-xs font-semibold rounded-full bg-background text-primary border border-primary md:border-2"
              >
                {style}
              </motion.span>
            ))}
          </motion.div>
          
          {/* Main Hero Content - Responsive positioning - Adjusted for mobile */}
          <div className="max-w-2xl pt-32 md:pt-48 lg:pt-56">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left relative"
            >
              {/* Dynamic Stats with Typing Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-start gap-2 mb-2 md:mb-4"
              >
                <span className="text-xl md:text-3xl font-display font-bold text-primary drop-shadow-lg">
                  <AnimatedTypingNumber numbers={typingNumbers} />
                </span>
                <span className="text-primary text-[10px] md:text-sm font-bold drop-shadow-lg">Happy Clients & Growing</span>
              </motion.div>
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-2 md:gap-3 justify-start mb-2 md:mb-4"
              >
                <Link to="/book">
                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button size="lg" className="btn-premium h-10 md:h-11 px-4 md:px-6 text-xs md:text-sm font-bold rounded-full group w-full">
                      <Sparkles className="mr-1.5 md:mr-2 h-3.5 md:h-4 w-3.5 md:w-4" />
                      Book Your Hair
                      <ArrowRight className="ml-1.5 md:ml-2 h-3.5 md:h-4 w-3.5 md:w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              
              {/* Typewriter Heading - Below buttons */}
              <motion.h1 
                className="font-display text-lg md:text-2xl lg:text-4xl font-bold leading-tight min-h-[1.5em] md:min-h-[2.5em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <TypewriterText texts={typewriterTexts} speed={80} />
              </motion.h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <VideoShowcase />

      {/* Men & Women Services Section */}
      <section className="py-6 md:py-8 relative">
        <div className="container mx-auto px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4 md:mb-6"
          >
            <div className="inline-flex items-center gap-2 mb-2">
              <Users className="w-4 md:w-5 h-4 md:h-5 text-primary" />
              <span className="text-primary text-xs md:text-sm font-bold tracking-wider uppercase">For Everyone</span>
            </div>
            <h2 className="font-display text-xl md:text-3xl font-bold">
              <span className="text-gradient-gold">Men</span> & <span className="text-gradient-gold">Women</span> Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
            {/* Women's Services */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-3 md:p-4 rounded-xl md:rounded-2xl border border-primary/20"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-8 md:w-12 h-8 md:h-12 rounded-full bg-gradient-to-br from-pink-500 to-primary flex items-center justify-center">
                  <Crown className="w-4 md:w-6 h-4 md:h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-sm md:text-xl font-bold text-foreground">Women's</h3>
                  <p className="text-foreground/60 text-[10px] md:text-sm hidden md:block">Elegant & Beautiful</p>
                </div>
              </div>
              <ul className="space-y-1 md:space-y-2">
                {['Knotless Braids', 'Cornrows', 'Faux Locs', 'Twists', 'Hair Treatment'].map((service, i) => (
                  <motion.li
                    key={service}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-sm text-foreground/80"
                  >
                    <CheckCircle2 className="w-3 md:w-4 h-3 md:h-4 text-primary flex-shrink-0" />
                    {service}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Men's Services */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-3 md:p-4 rounded-xl md:rounded-2xl border border-primary/20"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-8 md:w-12 h-8 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center">
                  <Scissors className="w-4 md:w-6 h-4 md:h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-sm md:text-xl font-bold text-foreground">Men's</h3>
                  <p className="text-foreground/60 text-[10px] md:text-sm hidden md:block">Sharp & Clean</p>
                </div>
              </div>
              <ul className="space-y-1 md:space-y-2">
                {['Cornrows', 'Box Braids', 'Twists', 'Dreadlocks', 'Hair Treatment'].map((service, i) => (
                  <motion.li
                    key={service}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-1.5 md:gap-2 text-[11px] md:text-sm text-foreground/80"
                  >
                    <CheckCircle2 className="w-3 md:w-4 h-3 md:h-4 text-primary flex-shrink-0" />
                    {service}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Home Services Section */}
      <section className="py-6 md:py-8 relative bg-primary/5">
        <div className="container mx-auto px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3"
            >
              <HomeIcon className="w-6 md:w-8 h-6 md:h-8 text-primary" />
            </motion.div>
            
            <h2 className="font-display text-xl md:text-3xl font-bold mb-2">
              <span className="text-gradient-gold">Home Service</span> Available
            </h2>
            <p className="text-foreground/70 mb-4 text-sm md:text-base max-w-xl mx-auto px-2">
              We'll come to you! Professional hair styling in the comfort of your home.
            </p>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4">
              {locations.map((loc, i) => (
                <motion.div
                  key={loc}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background border border-primary/30"
                >
                  <MapPin className="w-3 h-3 text-primary" />
                  <span className="font-semibold text-foreground text-xs md:text-sm">{loc}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-3">
              <motion.div whileTap={{ scale: 0.97 }}>
                <Link to="/book">
                  <Button className="btn-premium h-11 md:h-10 px-5 rounded-full font-bold w-full sm:w-auto">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Book Home Service
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.97 }}>
                <a href={`tel:${settings.phone}`}>
                  <Button variant="outline" className="h-11 md:h-10 px-5 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold w-full sm:w-auto">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hair Treatment Section */}
      <section className="py-6 md:py-8 relative">
        <div className="container mx-auto px-3 md:px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center gap-2 mb-2">
              <Heart className="w-4 md:w-5 h-4 md:h-5 text-primary" />
              <span className="text-primary text-xs md:text-sm font-bold tracking-wider uppercase">Hair Care</span>
            </div>
            <h2 className="font-display text-xl md:text-3xl font-bold">
              Professional <span className="text-gradient-gold">Hair Treatment</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 max-w-5xl mx-auto mb-4">
            {[
              { icon: Sparkles, title: 'Deep Conditioning', desc: 'Restore moisture' },
              { icon: Heart, title: 'Scalp Treatment', desc: 'Healthy scalp' },
              { icon: Palette, title: 'Hair Repair', desc: 'Fix damage' },
              { icon: Clock, title: 'Growth Therapy', desc: 'Promote growth' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-3 md:p-4 rounded-lg md:rounded-xl text-center border border-primary/10"
              >
                <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-4 md:w-5 h-4 md:h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-xs md:text-sm mb-0.5">{item.title}</h3>
                <p className="text-[10px] md:text-xs text-foreground/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center"
          >
            <Link to="/book">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="btn-premium h-11 px-8 rounded-full font-bold">
                  <Heart className="mr-2 h-4 w-4" />
                  Book Your Hair
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section - Premium Design */}
      <section className="py-10 md:py-14 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 mb-4"
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-3">
              Our <span className="text-gradient-gold">Masterpieces</span>
            </h2>
            <p className="text-foreground/60 max-w-lg mx-auto">
              Every style tells a story. Explore our collection of stunning transformations.
            </p>
          </motion.div>

          {/* Premium Masonry Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 auto-rows-[200px] md:auto-rows-[250px]">
            {galleryData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                  item.featured ? 'col-span-2 row-span-2' : 
                  index === 4 ? 'row-span-2' : ''
                }`}
              >
                {/* Image Container */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Glowing Border on Hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl z-20 pointer-events-none"
                  initial={false}
                  whileHover={{ 
                    boxShadow: "inset 0 0 0 3px hsl(var(--primary))",
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Image */}
                <motion.img
                  src={item.img}
                  alt={item.style}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                
                {/* Category Badge */}
                <motion.div
                  className="absolute top-3 left-3 z-30"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                    item.category === 'men' 
                      ? 'bg-blue-500/80 text-white' 
                      : 'bg-pink-500/80 text-white'
                  }`}>
                    {item.category}
                  </span>
                </motion.div>

                {/* Featured Badge */}
                {item.featured && (
                  <motion.div
                    className="absolute top-3 right-3 z-30"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-bold backdrop-blur-md">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </span>
                  </motion.div>
                )}

                {/* Hover Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <motion.div
                    initial={false}
                    className="space-y-2"
                  >
                    <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                      {item.style}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <Link to="/book">
                      <Button size="sm" className="mt-2 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground text-xs">
                        Book This Style
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
              </motion.div>
            ))}
          </div>

          {/* Gallery Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-4 flex-wrap justify-center">
              <a href={`https://instagram.com/${settings.instagramHandle}`} target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 h-12 font-semibold">
                    <Instagram className="mr-2 h-5 w-5" />
                    Follow @lacouronne
                  </Button>
                </motion.div>
              </a>
              <Link to="/book">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="btn-premium rounded-full px-6 h-12 font-bold">
                    <Crown className="mr-2 h-5 w-5" />
                    Book Your Style
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Men's Exclusive Gallery Section */}
      <section className="py-10 md:py-14 relative overflow-hidden bg-gradient-to-b from-background via-blue-950/5 to-background">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              y: [0, -30, 0],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
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
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-primary/20 mb-4"
            >
              <Scissors className="w-10 h-10 text-blue-400" />
            </motion.div>
            <motion.h2 
              className="font-display text-3xl md:text-5xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Men's <span className="bg-gradient-to-r from-blue-400 via-primary to-blue-400 bg-clip-text text-transparent">Exclusive</span> Collection
            </motion.h2>
            <motion.p 
              className="text-foreground/60 max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Bold looks for the modern man. From clean cornrows to intricate designs.
            </motion.p>
          </motion.div>

          {/* Premium Men's Image Gallery - Mobile Horizontal Scroll */}
          <div className="md:hidden relative">
            {/* Swipe hint */}
            <motion.div 
              className="flex items-center justify-center gap-2 mb-3 text-foreground/50 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>Swipe to explore</span>
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
            
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-3" style={{ width: 'max-content' }}>
                {menGalleryData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openLightbox(index)}
                    className="relative overflow-hidden rounded-xl shadow-lg flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
                    style={{ width: '160px' }}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.style}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-semibold text-sm">{item.style}</p>
                      <p className="text-blue-400 text-xs">{item.highlight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Right fade gradient indicator */}
            <div className="absolute right-0 top-8 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>

          {/* Premium Men's Image Gallery - Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {menGalleryData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => openLightbox(index)}
                className="group relative overflow-hidden rounded-2xl shadow-xl cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.style}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-lg">{item.style}</p>
                  <p className="text-blue-400 text-sm">{item.highlight}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Lightbox Modal */}
          <AnimatePresence>
            {lightboxIndex !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                onClick={closeLightbox}
              >
                {/* Close button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                {/* Previous button */}
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                {/* Next button */}
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Image */}
                <motion.div
                  key={lightboxIndex}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative max-w-4xl max-h-[85vh] mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={menGalleryData[lightboxIndex].img}
                    alt={menGalleryData[lightboxIndex].style}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                    <p className="text-white font-bold text-xl">{menGalleryData[lightboxIndex].style}</p>
                    <p className="text-blue-400">{menGalleryData[lightboxIndex].highlight}</p>
                  </div>
                </motion.div>

                {/* Dot indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {menGalleryData.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                      className={`w-2 h-2 rounded-full transition-all ${idx === lightboxIndex ? 'bg-primary w-6' : 'bg-white/40 hover:bg-white/60'}`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link to="/book">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="rounded-full bg-gradient-to-r from-blue-500 via-primary to-blue-500 hover:from-blue-600 hover:via-primary hover:to-blue-600 text-white px-8 h-14 font-bold text-base shadow-xl shadow-blue-500/30">
                  <Scissors className="mr-2 h-5 w-5" />
                  Book Men's Style
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-10 relative bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Crown className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">
              Ready to <span className="text-gradient-gold">Transform</span> Your Look?
            </h2>
            <p className="text-foreground/70 mb-6 max-w-md mx-auto">
              Book your appointment today or request home service across North Cyprus
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/book">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button className="btn-premium h-12 px-8 rounded-full font-bold text-base">
                    <Crown className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                </motion.div>
              </Link>
              <a href={`https://wa.me/${(settings.whatsappNumber || '905338709271').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" className="h-12 px-8 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold text-base">
                    WhatsApp Us
                  </Button>
                </motion.div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
