import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, MapPin, Phone, Instagram, Play } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

// Placeholder images - will be replaced with actual salon images
const heroImages = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80',
];

const galleryImages = [
  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80',
  'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80',
  'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&q=80',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80',
];

const formatPrice = (price: number) => `₺${price.toLocaleString('tr-TR')}`;

export function Home() {
  const { services, staff, settings } = useSalon();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const signatureServices = services.filter(s => s.active).slice(0, 4);
  
  return (
    <div className="relative">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${heroImages[0]})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
        </motion.div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full bg-primary/5 blur-3xl"
          />
        </div>
        
        {/* Content */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p 
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="text-primary/80 text-sm font-medium tracking-[0.3em] uppercase mb-6"
            >
              İstanbul's Premier Hair Atelier
            </motion.p>
            
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-light mb-6 tracking-tight">
              <span className="block">Where Beauty</span>
              <span className="block text-gradient-gold font-medium">Becomes Art</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/60 max-w-xl mx-auto mb-10 font-light">
              Experience transformative hair artistry in an atmosphere of 
              uncompromising luxury and refined elegance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button size="lg" className="btn-premium h-14 px-10 text-lg font-medium rounded-full">
                  Book Experience
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <a href={`https://instagram.com/${settings.instagramHandle}`} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-light rounded-full border-white/20 hover:bg-white/5">
                  <Instagram className="mr-3 h-5 w-5" />
                  @{settings.instagramHandle}
                </Button>
              </a>
            </div>
          </motion.div>
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
            className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent"
          />
        </motion.div>
      </section>
      
      {/* Services Section */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">Our Expertise</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
              Signature <span className="text-gradient-gold">Services</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {signatureServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={`/book?service=${service.id}`}>
                  <div className="group glass-dark rounded-2xl p-6 h-full magnetic cursor-pointer hover:border-primary/30 transition-colors duration-500">
                    <div className="text-primary/60 text-xs tracking-[0.2em] uppercase mb-3">
                      {service.category}
                    </div>
                    <h3 className="font-display text-2xl font-light mb-3 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-foreground/50 text-sm mb-6 line-clamp-2 font-light">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-2xl font-light">{formatPrice(service.price)}</span>
                      <span className="text-foreground/40 text-sm">{service.durationMin} min</span>
                    </div>
                  </div>
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
              <Button variant="ghost" size="lg" className="text-primary hover:text-primary/80 line-animate">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">Our Work</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
              Artistry in <span className="text-gradient-gold">Motion</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl group ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className={`aspect-square ${index === 0 ? 'md:aspect-auto md:h-full' : ''}`}>
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              <Button variant="outline" size="lg" className="rounded-full border-white/20 hover:bg-white/5">
                <Instagram className="mr-2 h-5 w-5" />
                See More on Instagram
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">The Artists</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
              Meet Our <span className="text-gradient-gold">Masters</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {staff.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group text-center"
              >
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <div className="aspect-[3/4]">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-2xl font-light">{member.name}</h3>
                    <p className="text-primary text-sm">{member.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-32 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImages[1]})` }}
          />
          <div className="absolute inset-0 bg-background/90" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light mb-8">
              Begin Your <span className="text-gradient-gold">Transformation</span>
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto mb-12 text-lg font-light">
              Every visit is an experience. Every style, a masterpiece.
              Book your appointment and discover the art of beauty.
            </p>
            <Link to="/book">
              <Button size="lg" className="btn-premium h-16 px-12 text-xl font-medium rounded-full">
                Book Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Bar */}
      <section className="py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-foreground/60">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span className="font-light">{settings.phone}</span>
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
              <MapPin className="h-4 w-4" />
              <span className="font-light">Nişantaşı, İstanbul</span>
            </a>
            <a href={`https://instagram.com/${settings.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Instagram className="h-4 w-4" />
              <span className="font-light">@{settings.instagramHandle}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
