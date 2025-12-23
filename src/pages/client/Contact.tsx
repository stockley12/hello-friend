import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle, ExternalLink } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { haptics } from '@/lib/haptics';

export function Contact() {
  const { settings } = useSalon();
  
  const formatHours = (hours: typeof settings.businessHours) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => {
      const dayHours = hours[day];
      return {
        day: day.charAt(0).toUpperCase() + day.slice(1),
        hours: dayHours ? `${dayHours.start} - ${dayHours.end}` : 'Closed',
      };
    });
  };
  
  const businessHours = formatHours(settings.businessHours);
  
  return (
    <div className="min-h-[100dvh] pb-20 md:pb-0">
      {/* Hero - Mobile optimized */}
      <section className="py-12 md:py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 md:mb-4">
              Get In Touch
            </h1>
            <p className="text-base md:text-lg text-muted-foreground px-2">
              We'd love to hear from you. Reach out for appointments, inquiries, or just to say hello.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Quick Actions - Mobile first */}
      <section className="py-6 md:hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-3">
            <motion.a
              href={`tel:${settings.phone}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => haptics.medium()}
              className="touch-feedback"
            >
              <Card className="bg-primary/10 border-primary/30 hover:bg-primary/20 transition-colors">
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-primary">Call Now</span>
                </CardContent>
              </Card>
            </motion.a>
            
            <motion.a
              href={`https://wa.me/${(settings.whatsappNumber || '905338709271').replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => haptics.medium()}
              className="touch-feedback"
            >
              <Card className="bg-green-500/10 border-green-500/30 hover:bg-green-500/20 transition-colors">
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-sm font-semibold text-green-500">WhatsApp</span>
                </CardContent>
              </Card>
            </motion.a>
          </div>
        </div>
      </section>
      
      {/* Contact Info */}
      <section className="py-8 md:py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 max-w-6xl mx-auto">
            {/* Info Cards */}
            <div className="space-y-4 md:space-y-6">
              {/* Location Card - Tappable on mobile */}
              <motion.a
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onClick={() => haptics.light()}
                className="block touch-feedback"
              >
                <Card className="glass-card md:card-premium">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm md:text-base mb-1">Visit Us</h3>
                          <ExternalLink className="w-4 h-4 text-muted-foreground md:hidden" />
                        </div>
                        <p className="text-muted-foreground text-sm md:text-base">{settings.address}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
              
              {/* Phone Card */}
              <motion.a
                href={`tel:${settings.phone}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onClick={() => haptics.light()}
                className="block touch-feedback"
              >
                <Card className="glass-card md:card-premium">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm md:text-base mb-1">Call Us</h3>
                        <p className="text-muted-foreground text-sm md:text-base">
                          {settings.phone}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
              
              {/* Email Card */}
              <motion.a
                href={`mailto:${settings.email}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={() => haptics.light()}
                className="block touch-feedback"
              >
                <Card className="glass-card md:card-premium">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm md:text-base mb-1">Email Us</h3>
                        <p className="text-muted-foreground text-sm md:text-base truncate">
                          {settings.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
              
              {/* Social Actions - Desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="hidden md:flex gap-4"
              >
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '905338709271').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full h-12 rounded-xl">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp
                  </Button>
                </a>
                <a
                  href={`https://instagram.com/${settings.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full h-12 rounded-xl">
                    <Instagram className="mr-2 h-5 w-5" />
                    Instagram
                  </Button>
                </a>
              </motion.div>
              
              {/* Instagram - Mobile */}
              <motion.a
                href={`https://instagram.com/${settings.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={() => haptics.light()}
                className="block touch-feedback md:hidden"
              >
                <Card className="glass-card bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border-pink-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Instagram className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Follow Us</h3>
                        <p className="text-muted-foreground text-sm">@{settings.instagramHandle}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.a>
            </div>
            
            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card md:card-premium h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-medium">Business Hours</h3>
                  </div>
                  
                  <div className="space-y-2 md:space-y-3">
                    {businessHours.map(({ day, hours }) => {
                      const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day.toLowerCase();
                      return (
                        <div 
                          key={day} 
                          className={`flex justify-between py-2 md:py-2.5 border-b border-border last:border-0 ${
                            isToday ? 'bg-primary/5 -mx-2 px-2 rounded-lg' : ''
                          }`}
                        >
                          <span className={`font-medium text-sm md:text-base ${isToday ? 'text-primary' : ''}`}>
                            {day}
                            {isToday && <span className="ml-2 text-xs text-primary">(Today)</span>}
                          </span>
                          <span className={`text-sm md:text-base ${hours === 'Closed' ? 'text-muted-foreground' : isToday ? 'text-primary font-semibold' : ''}`}>
                            {hours}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map Placeholder - Mobile optimized */}
      <section className="py-8 md:py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => haptics.light()}
              className="block"
            >
              <div className="aspect-[4/3] md:aspect-[21/9] bg-muted rounded-xl md:rounded-2xl flex items-center justify-center relative overflow-hidden group">
                {/* Decorative map-like pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute bg-primary/20 rounded-full"
                      style={{
                        width: `${60 + i * 40}px`,
                        height: `${60 + i * 40}px`,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>
                
                <div className="text-center relative z-10 p-6">
                  <motion.div
                    className="w-14 h-14 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MapPin className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                  </motion.div>
                  <p className="text-foreground font-medium text-sm md:text-base mb-1">
                    Open in Maps
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground max-w-xs mx-auto">
                    {settings.address}
                  </p>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
}
