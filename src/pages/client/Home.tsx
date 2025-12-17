import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, MapPin, Phone, Instagram, Crown, Scissors } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';

// Import your images
import logo from '@/assets/logo.png';
import heroImage from '@/assets/hero-image.jpeg';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';

const galleryImages = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

const formatPrice = (price: number) => `₺${price.toLocaleString('tr-TR')}`;

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [null, Math.random() * -200 - 100],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

// Text reveal animation
const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: i * 0.03,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export function Home() {
  const { services, settings } = useSalon();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  const signatureServices = services.filter(s => s.active).slice(0, 4);
  
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Cursor Glow Effect */}
      <motion.div
        className="cursor-glow hidden md:block"
        style={{ x: smoothMouseX, y: smoothMouseY }}
      />
      
      <FloatingParticles />
      
      {/* Hero Section - Completely Redesigned */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
            }}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute bottom-[-30%] left-[-20%] w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 60%)',
            }}
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Main Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 container mx-auto px-4"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[85vh]">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              {/* Logo with Glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                className="mb-6 lg:mb-8"
              >
                <motion.img 
                  src={logo} 
                  alt="La'Couronne" 
                  className="h-32 sm:h-40 md:h-48 lg:h-56 w-auto mx-auto lg:mx-0"
                  style={{ 
                    filter: 'drop-shadow(0 0 40px hsl(var(--primary) / 0.5))'
                  }}
                  animate={{ 
                    filter: [
                      'drop-shadow(0 0 40px hsl(var(--primary) / 0.3))',
                      'drop-shadow(0 0 60px hsl(var(--primary) / 0.6))',
                      'drop-shadow(0 0 40px hsl(var(--primary) / 0.3))'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              
              {/* Animated Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-primary font-bold tracking-wider text-xs sm:text-sm uppercase">
                    Here To Guide Your Hair Journey
                  </span>
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </span>
              </motion.div>
              
              {/* Main Heading with Character Animation */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                {isLoaded && (
                  <>
                    <AnimatedText text="Crowned" className="text-foreground" />
                    <br />
                    <span className="relative">
                      <AnimatedText text="In Beauty" className="text-gradient-gold" />
                      <motion.span
                        className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                      />
                    </span>
                  </>
                )}
              </h1>
              
              {/* Description with Stagger */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="text-base sm:text-lg md:text-xl text-foreground/70 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                Expert in <span className="text-primary font-semibold">cornrows, twists, knotless braids, 
                faux locs, passion twists</span> and more beautiful styles for men & women.
              </motion.p>
              
              {/* CTA Buttons with Hover Effects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/book">
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px hsl(var(--primary) / 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="lg" className="btn-premium h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg font-bold rounded-full group w-full sm:w-auto">
                      <Crown className="mr-2 h-5 w-5" />
                      Book Now
                      <motion.span
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.span>
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/services">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="h-14 sm:h-16 px-8 sm:px-12 text-base sm:text-lg rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold w-full sm:w-auto"
                    >
                      Explore Services
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Right Side - Hero Image with Effects */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 50 }}
              className="order-1 lg:order-2 relative"
              style={{ y: imageY }}
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Elements */}
                <motion.div
                  className="absolute -top-8 -right-8 w-24 h-24 border-2 border-primary/30 rounded-full"
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Golden Frame Container */}
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Outer Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/40 via-primary/20 to-primary/40 blur-2xl transform scale-105" />
                  
                  {/* Main Image Container */}
                  <div className="relative rounded-3xl overflow-hidden border-4 border-primary/50 shadow-2xl">
                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl"
                      style={{
                        background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)',
                      }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Image */}
                    <motion.img
                      src={heroImage}
                      alt="Beautiful Hair Art"
                      className="w-full aspect-[4/5] object-cover"
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.5 }}
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    
                    {/* Floating Badge */}
                    <motion.div
                      className="absolute bottom-6 left-6 right-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      <div className="glass-card p-4 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-primary font-bold text-sm">Hair Artistry</p>
                            <p className="text-foreground/70 text-xs">Men & Women Styles</p>
                          </div>
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Crown className="w-8 h-8 text-primary" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Corner Accents */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs tracking-widest text-primary/70 uppercase font-medium">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Gallery Section with Golden Frames */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase">Our Work</span>
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Beautiful <span className="text-gradient-gold">Creations</span>
            </h2>
          </motion.div>
          
          {/* Gallery Grid with Golden Frames */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -10, scale: 1.03 }}
                className={`group ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`golden-frame img-zoom ${index === 0 ? 'rounded-3xl' : 'rounded-2xl'} animate-pulse-gold`}>
                  <div className={`aspect-square ${index === 0 ? 'md:aspect-[4/3]' : ''}`}>
                    <img
                      src={img}
                      alt={`Hairstyle ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a href={`https://instagram.com/${settings.instagramHandle}`} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 h-14 font-semibold group">
                <Instagram className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                More on Instagram
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Scissors className="w-5 h-5 text-primary" />
              <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase">Services</span>
              <Scissors className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              What We <span className="text-gradient-gold">Offer</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {signatureServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/book?service=${service.id}`}>
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-6 h-full cursor-pointer hover:border-primary/50 transition-all duration-500"
                  >
                    <span className="text-xs font-bold tracking-wide text-primary uppercase">
                      {service.category}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold mt-2 mb-3 text-foreground">
                      {service.name}
                    </h3>
                    <p className="text-foreground/60 text-sm mb-6 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-primary/20">
                      <span className="text-2xl font-display font-bold text-primary">{formatPrice(service.price)}</span>
                      <span className="text-foreground/50 text-sm">{service.durationMin} min</span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/services">
              <Button variant="ghost" size="lg" className="text-primary hover:text-primary/80 line-animate font-semibold">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo in CTA */}
            <motion.img
              src={logo}
              alt="La'Couronne"
              className="h-24 md:h-32 w-auto mx-auto mb-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.4))' }}
            />
            
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Ready to <span className="text-gradient-gold">Transform?</span>
            </h2>
            <p className="text-foreground/70 max-w-lg mx-auto mb-10 text-lg">
              Book your appointment today and let us create beautiful styles for you.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/book">
                <Button size="lg" className="btn-premium h-16 px-14 text-xl font-bold rounded-full">
                  <Heart className="mr-3 h-6 w-6" />
                  Book Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Bar */}
      <section className="py-12 border-t border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: Phone, text: settings.phone, href: `tel:${settings.phone}` },
              { icon: MapPin, text: settings.address, href: "#" },
              { icon: Instagram, text: `@${settings.instagramHandle}`, href: `https://instagram.com/${settings.instagramHandle}` },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{item.text}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
