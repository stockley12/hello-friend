import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Scissors, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageShowcase } from '@/components/ImageShowcase';

const womenServices = [
  { name: 'Box Braids', desc: 'Classic protective style that lasts weeks' },
  { name: 'Knotless Braids', desc: 'Seamless, lightweight, natural-looking' },
  { name: 'Cornrows', desc: 'Timeless patterns, endless creativity' },
  { name: 'Twist Styles', desc: 'Senegalese, passion, spring twists' },
  { name: 'Locs & Maintenance', desc: 'Start, style, and maintain your journey' },
  { name: 'Natural Hair Care', desc: 'Deep treatments & silk press' },
];

const menServices = [
  { name: 'Precision Cuts', desc: 'Sharp fades, clean lines, perfect shape' },
  { name: 'Beard Grooming', desc: 'Sculpted, shaped, conditioned' },
  { name: 'Cornrow Designs', desc: 'Classic to creative patterns' },
  { name: 'Loc Styles', desc: 'Retwist, styling, maintenance' },
  { name: 'Hair Treatments', desc: 'Scalp care & conditioning' },
  { name: 'Full Grooming', desc: 'Complete transformation package' },
];

export function Services() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero */}
      <section className="relative py-32 md:py-44 overflow-hidden">
        {/* Unisex background design */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.2),transparent_70%)]" />
        
        {/* Animated floating hair strands */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <svg width="60" height="120" viewBox="0 0 60 120" className="text-primary">
              <path 
                d="M30 0 Q45 20, 30 40 Q15 60, 30 80 Q45 100, 30 120" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        ))}
        
        {/* Animated braid pattern - left side */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 opacity-15"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="200" height="600" viewBox="0 0 200 600" className="text-primary">
            <path d="M50 0 Q100 50, 50 100 Q0 150, 50 200 Q100 250, 50 300 Q0 350, 50 400 Q100 450, 50 500 Q0 550, 50 600" 
              stroke="currentColor" strokeWidth="3" fill="none" />
            <path d="M100 0 Q150 50, 100 100 Q50 150, 100 200 Q150 250, 100 300 Q50 350, 100 400 Q150 450, 100 500 Q50 550, 100 600" 
              stroke="currentColor" strokeWidth="3" fill="none" />
            <path d="M150 0 Q200 50, 150 100 Q100 150, 150 200 Q200 250, 150 300 Q100 350, 150 400 Q200 450, 150 500 Q100 550, 150 600" 
              stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
        </motion.div>
        
        {/* Animated braid pattern - right side */}
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2 opacity-15 rotate-180"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <svg width="200" height="600" viewBox="0 0 200 600" className="text-primary">
            <path d="M50 0 Q100 50, 50 100 Q0 150, 50 200 Q100 250, 50 300 Q0 350, 50 400 Q100 450, 50 500 Q0 550, 50 600" 
              stroke="currentColor" strokeWidth="3" fill="none" />
            <path d="M100 0 Q150 50, 100 100 Q50 150, 100 200 Q150 250, 100 300 Q50 350, 100 400 Q150 450, 100 500 Q50 550, 100 600" 
              stroke="currentColor" strokeWidth="3" fill="none" />
            <path d="M150 0 Q200 50, 150 100 Q100 150, 150 200 Q200 250, 150 300 Q100 350, 150 400 Q200 450, 150 500 Q100 550, 150 600" 
              stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
        </motion.div>
        
        {/* Animated scissors */}
        <motion.div 
          className="absolute top-20 left-[15%] opacity-10"
          animate={{ rotate: [45, 55, 45], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Scissors className="w-32 h-32 text-primary" />
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-[15%] opacity-10"
          animate={{ rotate: [-12, -22, -12], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Scissors className="w-24 h-24 text-primary" />
        </motion.div>
        
        {/* Animated sparkles */}
        <motion.div 
          className="absolute top-32 right-[20%]"
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
        <motion.div 
          className="absolute bottom-32 left-[25%]"
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>
        <motion.div 
          className="absolute top-[60%] right-[30%]"
          animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.4, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Sparkles className="w-5 h-5 text-primary" />
        </motion.div>
        
        {/* Animated geometric accents */}
        <motion.div 
          className="absolute top-1/4 left-[10%] w-40 h-40 border border-primary/20 rounded-full"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-[10%] w-32 h-32 border border-primary/20 rounded-full"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div className="absolute top-1/3 right-[5%] w-20 h-20 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-1/3 left-[5%] w-24 h-24 bg-primary/10 rounded-full blur-xl" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/30 mb-8"
            >
              <Crown className="w-10 h-10 text-primary" />
            </motion.div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
              <span className="text-foreground">Your </span>
              <span className="text-gradient-gold">Crown</span>
              <br />
              <span className="text-foreground">Our Craft</span>
            </h1>
            
            <p className="text-foreground/60 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
              Expert braiding, natural hair care, and precision grooming 
              for those who refuse to settle for ordinary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Women's Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Animated Image Showcase */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <ImageShowcase direction="right" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 text-primary mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-bold tracking-[0.2em] uppercase">For Her</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Queen-Level<br />
                <span className="text-gradient-gold">Hair Artistry</span>
              </h2>
              
              <p className="text-foreground/60 text-lg mb-10 leading-relaxed">
                From protective styles that last for weeks to natural hair treatments 
                that restore your crown's glory. Every braid tells a story.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {womenServices.map((service, i) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-foreground/50">{service.desc}</p>
                  </motion.div>
                ))}
              </div>

              <Link to="/book">
                <Button size="lg" className="btn-premium rounded-full px-10 font-bold group">
                  Book Your Style
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Men's Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 text-primary mb-4">
                <Scissors className="w-5 h-5" />
                <span className="text-sm font-bold tracking-[0.2em] uppercase">For Him</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Sharp Cuts,<br />
                <span className="text-gradient-gold">Clean Living</span>
              </h2>
              
              <p className="text-foreground/60 text-lg mb-10 leading-relaxed">
                Precision fades, detailed lineup, and expert grooming. 
                Walk out looking like you own the room. Every. Single. Time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {menServices.map((service, i) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all duration-300"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-foreground/50">{service.desc}</p>
                  </motion.div>
                ))}
              </div>

              <Link to="/book">
                <Button size="lg" className="btn-premium rounded-full px-10 font-bold group">
                  Book Your Cut
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Animated Image Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <ImageShowcase direction="left" videos={['/videos/men-1.mp4', '/videos/men-2.mp4', '/videos/men-3.mp4', '/videos/men-4.mp4', '/videos/men-5.mp4', '/videos/men-6.mp4', '/videos/men-7.mp4', '/videos/men-8.mp4', '/videos/men-9.mp4']} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Ready to <span className="text-gradient-gold">Transform?</span>
            </h2>
            <p className="text-foreground/60 text-xl mb-10 max-w-xl mx-auto">
              Book your appointment today and let us show you 
              what happens when skill meets passion.
            </p>
            <Link to="/book">
              <Button size="lg" className="btn-premium rounded-full px-12 py-6 text-lg font-bold">
                Book Your Appointment
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
