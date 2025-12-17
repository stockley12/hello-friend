import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Instagram, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

interface ClientLayoutProps {
  children: ReactNode;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/book', label: 'Book' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function ClientLayout({ children }: ClientLayoutProps) {
  const { settings } = useSalon();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="glass">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 z-50">
                <img src={logo} alt="La'Couronne" className="h-14 w-auto" />
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-sm font-medium tracking-wide transition-colors line-animate ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-foreground/70 hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              {/* Desktop CTA */}
              <div className="hidden md:flex items-center gap-4">
                <Link to="/book">
                  <Button className="btn-premium rounded-full px-6">
                    Book Now
                  </Button>
                </Link>
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden z-50 p-2"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background z-40 md:hidden"
            >
              <nav className="flex flex-col items-center justify-center h-full gap-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-display text-3xl font-medium ${
                        location.pathname === link.href ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="lg" className="btn-premium rounded-full mt-4">
                      Book Appointment
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 pt-20">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-foreground/10 mt-auto bg-white/50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <img src={logo} alt="La'Couronne" className="h-20 w-auto mb-4" />
              <p className="text-muted-foreground mb-2 text-sm font-medium tracking-wide">
                Every Strand Matters
              </p>
              <p className="text-muted-foreground mb-6 max-w-md font-light leading-relaxed">
                Premium hairstyling for men and women. Braids, locs, natural hair care, 
                and more - crafted with love and expertise.
              </p>
              <div className="flex gap-4">
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  aria-label="WhatsApp"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <a
                  href={`https://instagram.com/${settings.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6 font-medium">Explore</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-foreground/70 hover:text-primary transition-colors font-light"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-6 font-medium">Contact</h4>
              <address className="not-italic space-y-3 text-foreground/70 font-light">
                <p className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                  <span>{settings.address}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{settings.phone}</span>
                </p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-light">
              © {new Date().getFullYear()} La'Couronne. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link to="/policies" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">
                Privacy
              </Link>
              <Link to="/policies" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass md:hidden z-40">
        <Link to="/book">
          <Button className="w-full btn-premium h-14 text-base rounded-full">
            Book Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
}
