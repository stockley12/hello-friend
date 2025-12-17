import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, MapPin, Phone, Instagram, Star, Crown } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { useRef, useEffect, useState } from 'react';

// Import your images
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import gallery6 from '@/assets/gallery-6.jpg';

const galleryImages = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

const formatPrice = (price: number) => `₺${price.toLocaleString('tr-TR')}`;

// Floating particle component
const FloatingParticle = ({ delay = 0, size = 8, x = 0, y = 0 }: { delay?: number; size?: number; x?: number; y?: number }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-primary/30 to-accent/30"
    style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -30, 0],
      x: [0, 10, 0],
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{
      duration: 5 + Math.random() * 3,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

// Animated text component
const AnimatedText = ({ text, className = "" }: { text: string; className?: string }) => {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.03,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export function Home() {
  const { services, staff, settings } = useSalon();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  
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
        {/* Animated Background */}
        <motion.div 
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${gallery5})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/80" />
        </motion.div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <FloatingParticle
              key={i}
              delay={i * 0.3}
              size={4 + Math.random() * 12}
              x={Math.random() * 100}
              y={Math.random() * 100}
            />
          ))}
          
          {/* Decorative Elements */}
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 w-64 h-64 rounded-full border border-primary/10"
          />
          <motion.div 
            animate={{ 
              rotate: [360, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-32 left-20 w-96 h-96 rounded-full border border-primary/5"
          />
        </div>
        
        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass mb-8"
            >
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium tracking-wide text-foreground/80">Premium Hair Artistry</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            
            {/* Main Heading */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-medium mb-8 tracking-tight leading-[0.9]">
              <AnimatedText text="Transform" className="block" />
              <span className="block text-gradient-rose mt-2">
                <AnimatedText text="Your Crown" />
              </span>
            </h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg md:text-xl lg:text-2xl text-foreground/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
            >
              Where artistry meets elegance. Experience stunning braids, 
              natural styles & transformations that celebrate your beauty.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/book">
                <Button size="lg" className="btn-premium h-16 px-12 text-lg font-medium rounded-full group">
                  <Heart className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Book Your Style
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="h-16 px-12 text-lg font-light rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                  Explore Services
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs tracking-widest text-foreground/40 uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Gallery Section - Main Feature */}
      <section className="py-24 md:py-40 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-primary text-sm tracking-[0.3em] uppercase mb-6"
            >
              <Star className="w-4 h-4" />
              Our Portfolio
              <Star className="w-4 h-4" />
            </motion.span>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium">
              Stunning <span className="text-gradient-rose">Creations</span>
            </h2>
          </motion.div>
          
          {/* Masonry Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -10 }}
                className={`group relative overflow-hidden rounded-3xl img-zoom glow-soft ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                } ${index === 3 ? 'md:col-span-2' : ''}`}
              >
                <div className={`aspect-[3/4] ${index === 0 ? 'md:aspect-square' : ''} ${index === 3 ? 'md:aspect-[2/1]' : ''}`}>
                  <img
                    src={img}
                    alt={`Braids style ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Hover Overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
                />
                
                {/* Hover Content */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                >
                  <p className="text-foreground font-display text-xl">View Style</p>
                  <p className="text-foreground/60 text-sm">Tap to explore</p>
                </motion.div>
                
                {/* Corner Accent */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/50 transition-all duration-500 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/50 transition-all duration-500 rounded-bl-lg" />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <a href={`https://instagram.com/${settings.instagramHandle}`} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-full border-primary/30 hover:bg-primary/10 px-10 h-14 group">
                <Instagram className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                More on Instagram
                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block">
              What We Offer
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-medium">
              Our <span className="text-gradient-gold">Services</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {signatureServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Link to={`/book?service=${service.id}`}>
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group glass-rose rounded-3xl p-8 h-full cursor-pointer hover:border-primary/40 transition-all duration-500"
                  >
                    <div className="text-primary/60 text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      {service.category}
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-medium mb-4 group-hover:text-gradient-rose transition-all duration-300">
                      {service.name}
                    </h3>
                    <p className="text-foreground/50 text-sm mb-8 line-clamp-2 font-light leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <span className="text-3xl font-display font-medium">{formatPrice(service.price)}</span>
                      <span className="text-foreground/40 text-sm flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        {service.durationMin} min
                      </span>
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
            className="text-center mt-12"
          >
            <Link to="/services">
              <Button variant="ghost" size="lg" className="text-primary hover:text-primary/80 line-animate text-lg">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Image Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="text-primary text-sm tracking-[0.3em] uppercase mb-4 block">
                Why Choose Us
              </span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-8">
                Artistry That <span className="text-gradient-rose">Speaks</span>
              </h2>
              <p className="text-foreground/60 text-lg leading-relaxed mb-8">
                We don't just style hair – we create transformations that celebrate your 
                unique beauty. Every braid, twist, and style is crafted with precision, 
                passion, and an eye for what makes you shine.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { number: "500+", label: "Happy Clients" },
                  { number: "50+", label: "Unique Styles" },
                  { number: "5★", label: "Rating" },
                  { number: "3+", label: "Years Experience" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-4 glass rounded-2xl"
                  >
                    <div className="font-display text-3xl md:text-4xl font-medium text-gradient-rose">{stat.number}</div>
                    <div className="text-foreground/50 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              <Link to="/book">
                <Button size="lg" className="btn-premium h-14 px-10 rounded-full">
                  Start Your Journey
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden glow-rose"
              >
                <img
                  src={gallery2}
                  alt="Featured style"
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </motion.div>
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.5 }
                }}
                className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-display text-xl font-medium">100%</div>
                    <div className="text-foreground/60 text-sm">Satisfaction</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-32 md:py-48 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${gallery3})` }}
          />
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <Crown className="w-16 h-16 text-primary mx-auto" />
            </motion.div>
            
            <h2 className="font-display text-4xl md:text-6xl lg:text-8xl font-medium mb-8">
              Ready to <span className="text-gradient-rose">Glow?</span>
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto mb-12 text-lg md:text-xl font-light">
              Your perfect style is waiting. Let's create magic together.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/book">
                <Button size="lg" className="btn-premium h-20 px-16 text-xl font-medium rounded-full">
                  <Sparkles className="mr-4 h-6 w-6" />
                  Book Now
                  <ArrowRight className="ml-4 h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Bar */}
      <section className="py-16 border-t border-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: Phone, text: settings.phone, href: `tel:${settings.phone}` },
              { icon: MapPin, text: "Nişantaşı, İstanbul", href: "#" },
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
                whileHover={{ scale: 1.05, color: 'hsl(var(--primary))' }}
                className="flex items-center gap-3 text-foreground/60 transition-colors"
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
