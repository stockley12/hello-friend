import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clock, Crown, Heart, Zap, Star, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const promoMessages = [
  {
    icon: Crown,
    title: "👑 Premium Hair Artistry",
    subtitle: "Book now & transform your look!",
    color: "from-yellow-500 to-amber-600",
  },
  {
    icon: Sparkles,
    title: "✨ Limited Spots Today!",
    subtitle: "Don't miss your appointment",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Clock,
    title: "⏰ Same Day Available",
    subtitle: "Book your session now",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Heart,
    title: "💖 Home Service Available",
    subtitle: "We come to you in North Cyprus",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Zap,
    title: "⚡ Quick Booking",
    subtitle: "2 steps to confirm via WhatsApp",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Star,
    title: "⭐ 100+ Happy Clients",
    subtitle: "Join our satisfied customers",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: Gift,
    title: "🎁 New Client Special",
    subtitle: "Book your first session today",
    color: "from-cyan-500 to-blue-600",
  },
];

export function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Show popup after 3 seconds, cycle every 8 seconds
  useEffect(() => {
    // Check if already shown this session
    const shownThisSession = sessionStorage.getItem('promo_shown');
    if (shownThisSession) {
      // Still show cycling messages but don't auto-popup
      return;
    }

    // Show first popup after 3 seconds
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem('promo_shown', 'true');
    }, 3000);

    return () => clearTimeout(showTimer);
  }, []);

  // Auto-hide after 6 seconds, then show next message after 10 seconds
  useEffect(() => {
    if (!isVisible || dismissed) return;

    // Hide after 6 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 6000);

    return () => clearTimeout(hideTimer);
  }, [isVisible, currentIndex, dismissed]);

  // Show next message after being hidden
  useEffect(() => {
    if (isVisible || dismissed) return;

    // Show next message after 12 seconds
    const nextTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % promoMessages.length);
      setIsVisible(true);
    }, 12000);

    return () => clearTimeout(nextTimer);
  }, [isVisible, dismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  const currentPromo = promoMessages[currentIndex];
  const IconComponent = currentPromo.icon;

  return (
    <AnimatePresence>
      {isVisible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:max-w-sm z-50"
        >
          <Link to="/book" onClick={() => setIsVisible(false)}>
            <motion.div
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentPromo.color} p-4 shadow-2xl cursor-pointer`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
              
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDismiss();
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center gap-3 relative z-10">
                {/* Icon */}
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </motion.div>

                {/* Text */}
                <div className="flex-1 pr-6">
                  <h3 className="font-bold text-white text-base md:text-lg leading-tight">
                    {currentPromo.title}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {currentPromo.subtitle}
                  </p>
                </div>
              </div>

              {/* Tap to book hint */}
              <motion.div
                className="mt-2 text-center"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-xs text-white/80 font-medium">
                  👆 Tap to Book Now
                </span>
              </motion.div>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}





