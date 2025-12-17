import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, MapPin, Phone } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Sarah M.',
    text: 'Absolutely transformed my hair! Alexandra understood exactly what I wanted. The attention to detail is unmatched.',
    rating: 5,
  },
  {
    name: 'Jessica L.',
    text: 'Best balayage I\'ve ever had. The salon atmosphere is so luxurious and relaxing. Worth every penny.',
    rating: 5,
  },
  {
    name: 'Amanda K.',
    text: 'I\'ve been coming here for years. The consistency and quality of service keeps me coming back.',
    rating: 5,
  },
];

export function Home() {
  const { services, staff, settings } = useSalon();
  
  const signatureServices = services.filter(s => s.active).slice(0, 4);
  const featuredStaff = staff.slice(0, 3);
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold mb-6 tracking-tight">
              Where Artistry
              <br />
              <span className="text-primary">Meets Excellence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience luxury hair care tailored to your unique style. 
              Our master stylists transform visions into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button size="lg" className="btn-luxury h-14 px-8 text-lg">
                  Book Your Experience
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                  View Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Quick Info Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur border-t border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Beverly Hills</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Open Today 9AM - 6PM</span>
              </div>
              <a 
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>{settings.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Signature Services */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Signature Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Curated experiences designed to enhance your natural beauty
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {signatureServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="card-premium h-full group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
                      {service.category}
                    </div>
                    <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">${service.price}</span>
                      <span className="text-muted-foreground">{service.durationMin} min</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="outline" size="lg">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Stylists */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Meet Our Artists
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              World-class talent dedicated to your transformation
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {featuredStaff.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-background shadow-xl">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-2xl font-display">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-display text-xl font-medium mb-1">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.title}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Client Love
            </h2>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-muted-foreground">4.9 out of 5 based on 500+ reviews</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="card-premium h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <p className="font-medium text-sm">— {testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-semibold mb-6">
              Ready for Your Transformation?
            </h2>
            <p className="text-background/70 max-w-xl mx-auto mb-8 text-lg">
              Book your appointment today and experience the difference of true luxury hair care.
            </p>
            <Link to="/book">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-lg btn-luxury"
              >
                Book Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
