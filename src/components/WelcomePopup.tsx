import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    message: "Finally found someone who gets my hair!",
    name: "Ayşe",
    type: "woman"
  },
  {
    message: "Best fade I've ever had. Period.",
    name: "Mehmet",
    type: "man"
  },
  {
    message: "My curls have never looked this good",
    name: "Zeynep",
    type: "woman"
  },
  {
    message: "Clean cuts, fair prices. What more do you need?",
    name: "Emre",
    type: "man"
  },
  {
    message: "She actually listens to what you want",
    name: "Elif",
    type: "woman"
  },
  {
    message: "Walk in looking tired, walk out looking fresh",
    name: "Can",
    type: "man"
  }
];

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [testimonial, setTestimonial] = useState(testimonials[0]);

  useEffect(() => {
    // Pick a random testimonial
    const randomIndex = Math.floor(Math.random() * testimonials.length);
    setTestimonial(testimonials[randomIndex]);
    
    // Show popup after a short delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className="relative bg-card rounded-2xl border border-border shadow-lg p-5">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              
              {/* Content */}
              <div className="pr-6">
                <div className="flex items-center gap-2 mb-3">
                  <Scissors className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    What they say
                  </span>
                </div>
                
                <p className="text-foreground text-lg font-medium mb-2">
                  "{testimonial.message}"
                </p>
                
                <p className="text-muted-foreground text-sm mb-4">
                  — {testimonial.name}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Starting from <span className="text-primary font-semibold">₺1,500</span>
                  </span>
                  
                  <Link to="/book" onClick={handleClose}>
                    <Button size="sm" className="rounded-full px-4">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
