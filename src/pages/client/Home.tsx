import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, MapPin, Phone, Instagram, Crown, Scissors, Star } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

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

const locations = ['Mağusa', 'Lefke', 'Lefkoşa'];

// Animated counter for stats
const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [target]);
  
  return <span>{count}{suffix}</span>;
};

export function Home() {
  const { services, settings } = useSalon();
  const [activeLocation, setActiveLocation] = useState(0);
  
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
  
  // Rotate through locations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLocation(prev => (prev + 1) % locations.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  
  const signatureServices = services.filter(s => s.active).slice(0, 4);
  
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Cursor Glow Effect */}
      <motion.div
        className="cursor-glow hidden md:block"
        style={{ x: smoothMouseX, y: smoothMouseY }}
      />
      
      {/* Hero Section - Compact & Eye-catching */}
      <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -20, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Top Bar - Location & Rating */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">North Cyprus</span>
              <span className="text-primary font-bold">•</span>
              <motion.span
                key={activeLocation}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-primary font-semibold"
              >
                {locations[activeLocation]}
              </motion.span>
            </div>
            <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className="w-4 h-4 fill-primary text-primary" />
                </motion.div>
              ))}
              <span className="ml-2 text-sm font-bold text-foreground">5.0</span>
            </div>
          </motion.div>
          
          {/* Main Hero Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              {/* Logo */}
              <motion.img 
                src={logo} 
                alt="La'Couronne" 
                className="h-28 sm:h-36 md:h-44 w-auto mx-auto lg:mx-0 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{ filter: 'drop-shadow(0 0 30px hsl(var(--primary) / 0.4))' }}
              />
              
              {/* Tagline Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 mb-4"
              >
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-xs font-bold tracking-wider text-primary uppercase">
                  Your Hair Journey Starts Here
                </span>
              </motion.div>
              
              {/* Heading */}
              <motion.h1 
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Premium{' '}
                <span className="text-gradient-gold relative">
                  Hair Artistry
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    <motion.path
                      d="M0 4 Q50 0 100 4 T200 4"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
              </motion.h1>
              
              {/* Services List */}
              <motion.div 
                className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {['Cornrows', 'Knotless Braids', 'Faux Locs', 'Twists'].map((style, i) => (
                  <motion.span
                    key={style}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--primary) / 0.2)' }}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-foreground/5 border border-foreground/10 text-foreground/70 cursor-default transition-colors"
                  >
                    {style}
                  </motion.span>
                ))}
                <span className="px-3 py-1 text-xs font-medium text-primary">+more</span>
              </motion.div>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6"
              >
                <Link to="/book">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button size="lg" className="btn-premium h-12 px-8 text-base font-bold rounded-full group w-full sm:w-auto">
                      <Crown className="mr-2 h-4 w-4" />
                      Book Appointment
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/services">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold w-full sm:w-auto">
                      View Services
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex justify-center lg:justify-start gap-8"
              >
                {[
                  { value: 500, suffix: '+', label: 'Happy Clients' },
                  { value: 5, suffix: '+', label: 'Years Experience' },
                  { value: 20, suffix: '+', label: 'Style Options' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    whileHover={{ y: -3 }}
                  >
                    <div className="text-2xl font-display font-bold text-primary">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs text-foreground/50">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* Right - Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="relative max-w-sm mx-auto lg:max-w-md">
                {/* Decorative ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-primary/20"
                  style={{ transform: 'rotate(3deg) scale(1.02)' }}
                  animate={{ rotate: [3, -3, 3] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Main Image */}
                <motion.div 
                  className="relative rounded-3xl overflow-hidden border-3 border-primary/40 shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                  <img
                    src={heroImage}
                    alt="Beautiful Hair Art"
                    className="w-full aspect-[3/4] object-cover"
                  />
                  
                  {/* Floating Badge */}
                  <motion.div
                    className="absolute bottom-4 left-4 right-4 z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="glass-card p-3 backdrop-blur-md flex items-center justify-between">
                      <div>
                        <p className="text-primary font-bold text-sm">Men & Women</p>
                        <p className="text-foreground/60 text-xs">Professional Styling</p>
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Crown className="w-6 h-6 text-primary" />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* Corner accents */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-3 border-l-3 border-primary rounded-tl-lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-3 border-r-3 border-primary rounded-tr-lg" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-3 border-l-3 border-primary rounded-bl-lg" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-3 border-r-3 border-primary rounded-br-lg" />
              </div>
            </motion.div>
          </div>
        </div>
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
