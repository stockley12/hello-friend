import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { ServiceCategory } from '@/types';

const categoryLabels: Record<ServiceCategory, string> = {
  cut: 'Cuts',
  color: 'Color',
  treatment: 'Treatments',
  styling: 'Styling',
  extensions: 'Extensions',
  braids: 'Braids',
  twists: 'Twists',
  locs: 'Locs',
  mens: 'Mens',
  natural: 'Natural Hair',
};

const formatPrice = (price: number) => `₺${price.toLocaleString('tr-TR')}`;

export function Services() {
  const { services } = useSalon();
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  
  const activeServices = services.filter(s => s.active);
  const categories = [...new Set(activeServices.map(s => s.category))] as ServiceCategory[];
  
  const filteredServices = selectedCategory === 'all'
    ? activeServices
    : activeServices.filter(s => s.category === selectedCategory);
  
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/5 to-transparent" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4">Our Services</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-foreground">
              Beautiful <span className="text-gradient-gold">Styles</span> For You
            </h1>
            <p className="text-muted-foreground text-lg">
              Expert braiding, natural hair care, and stunning transformations 
              for men and women. Every strand matters.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-card border border-border text-foreground/70 hover:border-primary hover:text-primary'
              }`}
            >
              All Services
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-card border border-border text-foreground/70 hover:border-primary hover:text-primary'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Services Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-2xl p-8 h-full flex flex-col group hover:shadow-xl transition-all duration-500"
                >
                  <div className="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3">
                    {categoryLabels[service.category]}
                  </div>
                  <h3 className="font-display text-2xl font-medium mb-4 text-foreground group-hover:text-gradient-gold transition-all">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 flex-1">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <div>
                      <span className="text-3xl font-display font-semibold text-foreground">{formatPrice(service.price)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{service.durationMin} min</span>
                    </div>
                  </div>
                  <Link to={`/book?service=${service.id}`} className="mt-6">
                    <Button className="w-full btn-premium rounded-full">
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-6 text-foreground">
              Not sure what you need?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Book a consultation and we will help you discover your perfect style.
            </p>
            <Link to="/book">
              <Button size="lg" className="btn-premium rounded-full px-10">
                Book Consultation
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
