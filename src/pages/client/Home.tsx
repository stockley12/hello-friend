import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, MapPin, Phone, Instagram, Star, Crown, Scissors } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { useRef, useEffect } from 'react';

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

export function Home() {
  const { services, settings } = useSalon();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
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
  
  const signatureServices = services.filter(s => s.active).slice(0, 4);
  
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Cursor Glow Effect */}
      <motion.div
        className="cursor-glow hidden md:block"
        style={{ x: smoothMouseX, y: smoothMouseY }}
      />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,hsl(48_100%_50%/0.1),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,hsl(48_100%_50%/0.08),transparent_50%)]" />
        </div>
        
        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Large Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <img 
                src={logo} 
                alt="La'Couronne" 
                className="h-40 md:h-56 lg:h-64 w-auto mx-auto drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 30px hsl(48 100% 50% / 0.3))' }}
              />
            </motion.div>
            
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-primary font-bold tracking-[0.25em] uppercase text-sm md:text-base mb-6"
            >
              Here To Guide You Throughout Your Hair Journey
            </motion.p>
            
            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-foreground leading-tight">
              Premium
              <span className="block text-gradient-gold">Hair Artistry</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              We make all kinds of hairstyles: <span className="text-primary font-medium">cornrows, twists, knotless braids, 
              all back, faux locs, passion twists</span>, and more for men & women.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button size="lg" className="btn-premium h-16 px-12 text-lg font-bold rounded-full group">
                  <Crown className="mr-2 h-5 w-5" />
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="h-16 px-12 text-lg rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold">
                  View Services
                </Button>
              </Link>
            </div>
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
              style={{ filter: 'drop-shadow(0 0 20px hsl(48 100% 50% / 0.4))' }}
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
