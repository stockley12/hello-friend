import { motion } from 'framer-motion';
import { Award, Heart, Sparkles, MapPin, HelpCircle } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export function About() {
  const { settings } = useSalon();
  
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
            <div className="flex items-center gap-2 text-primary mb-4">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Magusa, North Cyprus</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-6">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Founded on the belief that everyone deserves to feel extraordinary. 
              {settings.name} has been transforming not just hair, but confidence, 
              one client at a time in the heart of Magusa.
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
                description: 'We pursue perfection in every braid, cut, and style. Our commitment to excellence is unwavering.',
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
      
      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border/50 rounded-xl px-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
