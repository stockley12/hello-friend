import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Scissors, Calendar, User, Phone } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/services', label: 'Services', icon: Scissors },
  { href: '/book', label: 'Book', icon: Calendar, primary: true },
  { href: '/about', label: 'About', icon: User },
  { href: '/contact', label: 'Contact', icon: Phone },
];

export function MobileNav() {
  const location = useLocation();
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-primary/20" />
      
      <div className="relative flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          if (item.primary) {
            return (
              <Link key={item.href} to={item.href} className="relative -mt-6">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-primary/40 rounded-full blur-xl scale-150" />
                  
                  {/* Button */}
                  <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Icon className="w-6 h-6 text-background" />
                  </div>
                  
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-primary whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          }
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className="relative flex flex-col items-center justify-center w-16 h-full"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center"
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 w-8 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
                <span 
                  className={`text-[10px] mt-1 transition-colors ${
                    isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}



