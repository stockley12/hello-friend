import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, MapPin, Phone, Instagram, Crown, Scissors, Star, ShoppingBag, Gem, Clock, CheckCircle2 } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { VideoShowcase } from '@/components/VideoShowcase';
import { useEffect, useState, useMemo } from 'react';

// Import men's images (keeping these)
import menStyle1 from '@/assets/men-style-1.jpg';
import menStyle2 from '@/assets/men-style-2.jpg';
import menStyle3 from '@/assets/men-style-3.jpg';
import menStyle4 from '@/assets/men-style-4.jpg';
import menStyle5 from '@/assets/men-style-5.jpg';
import menStyle6 from '@/assets/men-style-6.jpg';

const menGalleryData = [
  { img: menStyle1, style: 'Feed-In Braids' },
  { img: menStyle2, style: 'Stitch Braids' },
  { img: menStyle3, style: 'Box Braids' },
  { img: menStyle4, style: 'Zig-Zag Design' },
  { img: menStyle5, style: 'Star Pattern' },
  { img: menStyle6, style: 'Pop Smoke' },
];

// Women's placeholder data
const womenPlaceholders = [
  { id: 1, label: 'Women Style 1' },
  { id: 2, label: 'Women Style 2' },
  { id: 3, label: 'Women Style 3' },
  { id: 4, label: 'Women Style 4' },
  { id: 5, label: 'Women Style 5' },
  { id: 6, label: 'Women Style 6' },
  { id: 7, label: 'Women Style 7' },
];

const formatPrice = (price: number) => `$${price.toLocaleString()}`;

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
    <span className="text-gradient-rose font-bold">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="text-primary"
      >
        |
      </motion.span>
    </span>
  );
};

export function Home() {
  const { services, settings } = useSalon();
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

  const typewriterTexts = useMemo(() => [
    'Premium Hair Artistry',
    'Expert Braiding',
    'Quality Hair Products',
    'Your Crown Awaits'
  ], []);

  const featuredProducts = [
    { name: 'Hair Bundles', price: 85, icon: Gem },
    { name: 'HD Lace Wigs', price: 150, icon: Crown },
    { name: 'Closures', price: 65, icon: Sparkles },
  ];
  
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Cursor Glow Effect */}
      <motion.div
        className="cursor-glow hidden md:block"
        style={{ x: smoothMouseX, y: smoothMouseY }}
      />
      
      {/* Hero Section - New Design */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-background to-accent/5" />
          <motion.div 
            className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Location Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Atlanta, Georgia</span>
                <div className="flex items-center gap-0.5 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
              >
                <span className="text-foreground">Welcome to</span>
                <br />
                <span className="text-gradient-rose">BriBraidsBeauty</span>
              </motion.h1>

              {/* Typewriter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl mb-6 h-8"
              >
                <TypewriterText texts={typewriterTexts} speed={80} />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Premium human hair bundles, wigs, and professional styling services for men & women. Your crown deserves the best.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/book">
                  <Button size="lg" className="btn-premium h-14 px-8 text-base rounded-full w-full sm:w-auto group">
                    <Crown className="mr-2 h-5 w-5" />
                    Book Appointment
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-primary/30 hover:bg-primary/10 w-full sm:w-auto">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Shop Products
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex items-center justify-center lg:justify-start gap-8 mt-10"
              >
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">500+</p>
                  <p className="text-xs text-muted-foreground">Happy Clients</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">5.0★</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">5+</p>
                  <p className="text-xs text-muted-foreground">Years Exp</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Featured Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                {menGalleryData.slice(0, 4).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`relative rounded-2xl overflow-hidden ${index === 0 || index === 3 ? 'aspect-[3/4]' : 'aspect-square'}`}
                  >
                    <img
                      src={item.img}
                      alt={item.style}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <p className="absolute bottom-3 left-3 text-sm font-semibold text-foreground">{item.style}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Floating badge */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                ✨ Book Today!
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <VideoShowcase />

      {/* Services Preview */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 block">Our Services</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Professional </span>
              <span className="text-gradient-rose">Styling</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Expert hairstyling for men and women. From braids to locs, we've got you covered.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Women's Services */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Crown className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Women's Styling</h3>
                  <p className="text-muted-foreground text-sm">Queen Services</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  { name: 'Knotless Braids', price: 250 },
                  { name: 'Box Braids', price: 180 },
                  { name: 'Goddess Locs', price: 280 },
                  { name: 'Passion Twists', price: 175 },
                  { name: 'Sew-In Weave', price: 200 },
                ].map((service, i) => (
                  <motion.li
                    key={service.name}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {service.name}
                    </span>
                    <span className="text-primary font-semibold">{formatPrice(service.price)}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Men's Services */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <Scissors className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Men's Styling</h3>
                  <p className="text-muted-foreground text-sm">King Services</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  { name: 'Cornrows', price: 75 },
                  { name: 'Two-Strand Twists', price: 100 },
                  { name: 'Locs', price: 150 },
                  { name: 'Box Braids', price: 120 },
                  { name: 'Fade + Design', price: 50 },
                ].map((service, i) => (
                  <motion.li
                    key={service.name}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      {service.name}
                    </span>
                    <span className="text-blue-500 font-semibold">{formatPrice(service.price)}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/services">
              <Button variant="outline" className="rounded-full px-8 h-12 border-primary/30 hover:bg-primary/10">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 block">Shop</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Premium </span>
              <span className="text-gradient-rose">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Quality human hair bundles, wigs, closures, frontals, and accessories
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-4 md:p-6 rounded-2xl text-center border border-primary/10 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <product.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-sm md:text-base text-foreground mb-1">{product.name}</h3>
                <p className="text-primary font-bold text-sm md:text-base">From {formatPrice(product.price)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Women's Gallery Section - Placeholders */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-bold tracking-wider uppercase mb-2 block">Gallery</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Women's </span>
              <span className="text-gradient-rose">Styles</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {womenPlaceholders.map((placeholder, index) => (
              <motion.div
                key={placeholder.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-primary/30 bg-card/50 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary/50" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{placeholder.label}</p>
                <p className="text-xs text-muted-foreground/60">Upload Image</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Men's Gallery Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-blue-500/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-blue-500 text-sm font-bold tracking-wider uppercase mb-2 block">Gallery</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Men's </span>
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Styles</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {menGalleryData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.style}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold">{item.style}</p>
                  <p className="text-blue-400 text-sm">Men's Style</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-accent/20" />
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Crown className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Ready for Your </span>
              <span className="text-gradient-rose">Transformation?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Book your appointment today or visit our shop for premium hair products
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button size="lg" className="btn-premium h-14 px-10 text-base rounded-full">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Book Now
                </Button>
              </Link>
              <a href={`https://wa.me/${(settings.whatsappNumber || '1234567890').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="h-14 px-10 text-base rounded-full border-green-500/50 text-green-500 hover:bg-green-500/10">
                  <Phone className="mr-2 h-5 w-5" />
                  WhatsApp Us
                </Button>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <a
                href={`https://instagram.com/bribraidsbeauty`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`tel:${settings.phone}`}
                className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
