import { motion } from 'framer-motion';
import { Award, Heart, Sparkles } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function About() {
  const { staff, settings } = useSalon();
  
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
        </div>
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Founded on the belief that everyone deserves to feel extraordinary. 
              {settings.name} has been transforming not just hair, but confidence, 
              one client at a time.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Sparkles,
                title: 'Excellence',
                description: 'We pursue perfection in every cut, color, and style. Our commitment to excellence is unwavering.',
              },
              {
                icon: Heart,
                title: 'Care',
                description: 'Your hair health is our priority. We use only premium, gentle products that nurture while they transform.',
              },
              {
                icon: Award,
                title: 'Expertise',
                description: 'Our team continuously trains with industry leaders, staying at the forefront of techniques and trends.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-medium mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* The Space */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">
                The Space
              </h2>
              <p className="text-muted-foreground mb-4">
                Step into our sanctuary designed for your complete comfort. Every detail, 
                from our curated music to our artisan refreshments, creates an atmosphere 
                of understated luxury.
              </p>
              <p className="text-muted-foreground">
                Our stations feature natural lighting optimized for color accuracy, 
                premium Italian leather chairs, and state-of-the-art equipment that 
                ensures both precision and comfort.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&q=80"
                alt="Salon interior"
                className="rounded-lg shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80"
                alt="Styling station"
                className="rounded-lg shadow-lg mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              The Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A collective of artists, innovators, and perfectionists dedicated to your transformation.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {staff.map((member, index) => (
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
                <h3 className="font-display text-lg font-medium">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.title}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
