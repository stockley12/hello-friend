import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, MapPin, Phone, Instagram, Star, Crown, Scissors } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';

// Import your images
import logo from '@/assets/logo.png';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';

const galleryImages = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

const formatPrice = (price: number) => `₺${price.toLocaleString('tr-TR')}`;

// Floating element component
const FloatingElement = ({ delay = 0, children, className = "" }: { delay?: number; children: React.ReactNode; className?: string }) => (
  <motion.div
    className={className}
    animate={{
      y: [0, -15, 0],
      rotate: [0, 2, 0],
    }}
    transition={{
      duration: 5 + Math.random() * 2,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

export function Home() {
  const { services, settings } = useSalon();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  const signatureServices = services.filter(s => s.active).slice(0, 4);
  
  return (
    <div className="relative overflow-hidden">
      {/* Cursor Glow Effect */}
      <motion.div
        className="cursor-glow hidden md:block"
        style={{ x: smoothMouseX, y: smoothMouseY }}
      />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full border border-primary/10"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full border border-accent/10"
          />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse-soft delay-200" />
        </div>
        
        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 container mx-auto px-4"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:text-left"
            >
              {/* Logo Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 mb-8"
              >
                <img src={logo} alt="La'Couronne" className="h-20 w-auto" />
              </motion.div>
              
              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-6"
              >
                Every Strand Matters
              </motion.p>
              
              {/* Main Heading */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium mb-6 text-foreground leading-tight">
                Premium Hair
                <span className="block text-gradient-gold">Artistry</span>
              </h1>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-10 font-light leading-relaxed">
                Beautiful braids, stunning styles & transformations for 
                <span className="text-foreground font-medium"> men </span> 
                and 
                <span className="text-foreground font-medium"> women</span>. 
                Crafted with love and expertise.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/book">
                  <Button size="lg" className="btn-premium h-14 px-10 text-base font-medium rounded-full group">
                    <Heart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full border-foreground/20 hover:bg-foreground/5 hover:border-primary transition-all duration-300">
                    View Services
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right: Featured Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden glow-soft"
                >
                  <img
                    src={gallery5}
                    alt="Featured hairstyle"
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                </motion.div>
                
                {/* Floating Cards */}
                <FloatingElement delay={0} className="absolute -top-6 -left-6">
                  <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-display text-lg font-medium text-foreground">5.0</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </FloatingElement>
                
                <FloatingElement delay={1} className="absolute -bottom-4 -right-4">
                  <div className="glass-card p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-display text-lg font-medium text-foreground">500+</div>
                      <div className="text-xs text-muted-foreground">Happy Clients</div>
                    </div>
                  </div>
                </FloatingElement>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs tracking-widest text-muted-foreground uppercase">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Gallery Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-primary text-sm tracking-[0.2em] uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              Our Work
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-medium text-foreground">
              Beautiful <span className="text-gradient-gold">Creations</span>
            </h2>
          </motion.div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                whileHover={{ y: -8 }}
                className={`group relative overflow-hidden rounded-2xl md:rounded-3xl img-zoom shadow-lg ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } ${index === 3 ? 'md:col-span-2' : ''}`}
              >
                <div className={`aspect-[3/4] ${index === 0 ? 'md:aspect-square' : ''} ${index === 3 ? 'md:aspect-[2/1]' : ''}`}>
                  <img
                    src={img}
                    alt={`Hairstyle ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Corner Accents */}
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/0 group-hover:border-white/60 transition-all duration-500 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/0 group-hover:border-white/60 transition-all duration-500 rounded-bl-lg" />
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
              <Button size="lg" variant="outline" className="rounded-full border-foreground/20 hover:border-primary px-8 h-12 group">
                <Instagram className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                More on Instagram
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 md:py-32 relative bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-primary text-sm tracking-[0.2em] uppercase mb-4">
              <Scissors className="w-4 h-4" />
              Services
              <Scissors className="w-4 h-4" />
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-medium text-foreground">
              What We <span className="text-gradient-rose">Offer</span>
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
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card rounded-2xl p-6 h-full cursor-pointer hover:shadow-xl transition-all duration-500"
                  >
                    <span className="text-xs font-medium tracking-wide text-primary uppercase">
                      {service.category}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-medium mt-2 mb-3 text-foreground">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                      <span className="text-2xl font-display font-medium text-foreground">{formatPrice(service.price)}</span>
                      <span className="text-muted-foreground text-sm">{service.durationMin} min</span>
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
              <Button variant="ghost" size="lg" className="text-primary hover:text-primary/80 line-animate">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <Crown className="w-16 h-16 text-primary mx-auto" />
            </motion.div>
            
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-medium mb-6 text-foreground">
              Ready to <span className="text-gradient-gold">Shine?</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-lg font-light">
              Book your appointment today and let us create magic with your hair.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/book">
                <Button size="lg" className="btn-premium h-16 px-12 text-lg font-medium rounded-full">
                  <Sparkles className="mr-3 h-5 w-5" />
                  Book Your Style
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Bar */}
      <section className="py-12 border-t border-foreground/10 bg-white/50">
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
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="font-light">{item.text}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
