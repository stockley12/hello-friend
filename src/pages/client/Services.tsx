import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ServiceCategory } from '@/types';

const categoryLabels: Record<ServiceCategory, string> = {
  cut: 'Cuts',
  color: 'Color',
  treatment: 'Treatments',
  styling: 'Styling',
  extensions: 'Extensions',
};

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
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground">
              From precision cuts to transformative color, discover our full range of luxury hair services.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Services */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <Tabs defaultValue="all" className="mb-10">
            <TabsList className="flex-wrap h-auto gap-2 bg-transparent justify-center">
              <TabsTrigger
                value="all"
                onClick={() => setSelectedCategory('all')}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                All Services
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger
                  key={category}
                  value={category}
                  onClick={() => setSelectedCategory(category)}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {categoryLabels[category]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="card-premium h-full flex flex-col">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                      {categoryLabels[service.category]}
                    </div>
                    <h3 className="font-display text-xl font-medium mb-3">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-semibold">${service.price}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{service.durationMin} min</span>
                      </div>
                    </div>
                    <Link to={`/book?service=${service.id}`} className="mt-4">
                      <Button className="w-full btn-luxury">
                        Book This Service
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services found in this category.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
            Not sure what you need?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Book a consultation with one of our stylists and let us help you discover your perfect look.
          </p>
          <Link to="/book">
            <Button size="lg" className="btn-luxury">
              Book a Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
