import { motion } from 'framer-motion';
import { Award, Heart, Sparkles, MapPin, HelpCircle, ChevronDown } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { haptics } from '@/lib/haptics';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const bookHeroBg = '/book-hero-bg.png?v=2';

const faqs = [
  {
    question: "Where exactly are you located in Magusa?",
    answer: "We're located in the heart of Magusa (Famagusta), easily accessible from the main city center. Our salon offers convenient parking and is just a short walk from the historic walled city."
  },
  {
    question: "Do I need to book an appointment in advance?",
    answer: "While walk-ins are welcome when we have availability, we highly recommend booking in advance to secure your preferred time slot. You can easily book through our website or give us a call."
  },
  {
    question: "What hair types do you specialize in?",
    answer: "Our stylists are trained in all hair types and textures. We specialize in braiding, locs, protective styles, cuts, coloring, and treatments for both natural and relaxed hair."
  },
  {
    question: "How long do braiding appointments typically take?",
    answer: "Braiding appointments vary depending on the style. Simple styles may take 2-3 hours, while intricate designs like small box braids or knotless braids can take 4-8 hours. We'll give you an accurate estimate during your consultation."
  },
  {
    question: "Do you offer services for men?",
    answer: "Absolutely! We offer a full range of men's services including haircuts, beard grooming, braids, locs, twists, and scalp treatments. Our barbers are skilled in all modern and classic styles."
  },
  {
    question: "What products do you use?",
    answer: "We use only premium, professional-grade products that are gentle on your hair and scalp. We carry brands that cater to all hair types and can recommend products for your home care routine."
  },
  {
    question: "Can I bring reference photos for my appointment?",
    answer: "Yes, please do! Reference photos help us understand exactly what you're looking for. We'll discuss what's achievable with your hair type and make recommendations based on your lifestyle."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We require at least 24 hours notice for cancellations or rescheduling. Late cancellations or no-shows may be subject to a fee. We understand emergencies happen, so please communicate with us."
  },
  {
    question: "Do you offer bridal and special occasion styling?",
    answer: "Yes! We love creating stunning looks for weddings, graduations, and special events. We recommend booking a trial appointment before your big day to perfect your look."
  },
  {
    question: "Is there parking available?",
    answer: "Yes, we have convenient parking available near our salon. Street parking is also available in the surrounding area of central Magusa."
  }
];

// Value Card Component
function ValueCard({ icon: Icon, title, description, index }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => haptics.light()}
      className="text-center p-4 md:p-6 glass-card rounded-2xl touch-feedback"
    >
      <motion.div 
        className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
      </motion.div>
      <h3 className="font-display text-lg md:text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm md:text-base">{description}</p>
    </motion.div>
  );
}

export function About() {
  const { settings } = useSalon();
  
  return (
    <div className="min-h-[100dvh] pb-20 md:pb-0">
      {/* Hero - Mobile optimized */}
      <section className="relative py-16 md:py-20 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bookHeroBg})`,
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
            <motion.div 
              className="flex items-center gap-2 text-primary mb-3 md:mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MapPin className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm font-medium tracking-wider uppercase">Magusa, North Cyprus</span>
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold mb-4 md:mb-6">
              Our Story
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Founded on the belief that everyone deserves to feel extraordinary. 
              {settings.name} has been transforming not just hair, but confidence, 
              one client at a time in the heart of Magusa.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Values - Mobile optimized grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
            <ValueCard
              icon={Sparkles}
              title="Excellence"
              description="We pursue perfection in every braid, cut, and style. Our commitment to excellence is unwavering."
              index={0}
            />
            <ValueCard
              icon={Heart}
              title="Care"
              description="Your hair health is our priority. We use only premium, gentle products that nurture while they transform."
              index={1}
            />
            <ValueCard
              icon={Award}
              title="Expertise"
              description="Our team continuously trains with industry leaders, staying at the forefront of techniques and trends."
              index={2}
            />
          </div>
        </div>
      </section>
      
      {/* The Space - Mobile optimized */}
      <section className="py-12 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 md:mb-6">
                The Space
              </h2>
              <p className="text-muted-foreground mb-4 text-sm md:text-base leading-relaxed">
                Step into our sanctuary designed for your complete comfort. Every detail, 
                from our curated music to our artisan refreshments, creates an atmosphere 
                of understated luxury.
              </p>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
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
              className="overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl order-1 lg:order-2"
            >
              <img
                src={bookHeroBg}
                alt="Our stylists showcasing braided hairstyles"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section - Mobile optimized */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.div 
              className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            </motion.div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 md:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto px-4">
              Everything you need to know about visiting us in Magusa. Can't find your answer? Feel free to contact us.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="w-full space-y-3 md:space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="glass-card border border-border/50 rounded-xl md:rounded-2xl px-4 md:px-6 shadow-sm data-[state=open]:shadow-md transition-shadow overflow-hidden"
                >
                  <AccordionTrigger 
                    className="text-left font-medium hover:no-underline py-4 md:py-5 text-sm md:text-base gap-3"
                    onClick={() => haptics.selection()}
                  >
                    <span className="flex-1 pr-2">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 md:pb-5 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
          
          {/* Scroll hint for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center mt-6 md:hidden"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center text-muted-foreground"
            >
              <span className="text-xs mb-1">Scroll for more</span>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
