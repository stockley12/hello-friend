import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Instagram, MapPin } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/MobileNav';
import { Logo } from '@/components/Logo';
import { PromoPopup } from '@/components/PromoPopup';

interface ClientLayoutProps {
  children: ReactNode;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/book', label: 'Book' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function ClientLayout({ children }: ClientLayoutProps) {
  const { settings } = useSalon();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col relative bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div 
          className="glass"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="container mx-auto px-3 md:px-4">
            <div className="flex items-center justify-between h-14 md:h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 z-50">
                <Logo size="sm" />
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-10" aria-label="Main navigation">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-sm font-semibold tracking-wide transition-colors line-animate ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-foreground/70 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              {/* Desktop CTA */}
              <div className="hidden md:flex items-center gap-4">
                <Link to="/book">
                  <Button className="btn-premium rounded-full px-6 font-bold">
                    Book Now
                  </Button>
                </Link>
              </div>
              
              {/* Mobile Menu Button */}
              <motion.button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden z-50 p-2 text-primary touch-manipulation"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background z-40 md:hidden"
              style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
              <nav className="flex flex-col items-center justify-center h-full gap-6 pb-20">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <Logo size="lg" />
                </motion.div>
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-display text-2xl font-bold ${
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
                  transition={{ delay: 0.4 }}
                  className="mt-4"
                >
                  <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="lg" className="btn-premium rounded-full font-bold px-8">
                      Book Appointment
                    </Button>
                  </Link>
                </motion.div>
                
                {/* Quick Contact */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4 mt-6"
                >
                  <a
                    href={`tel:${settings.phone}`}
                    className="w-12 h-12 rounded-full border-2 border-primary/50 flex items-center justify-center"
                  >
                    <Phone className="h-5 w-5 text-primary" />
                  </a>
                  <a
                    href={`https://wa.me/${(settings.whatsappNumber || '905338709271').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border-2 border-primary/50 flex items-center justify-center"
                  >
                    <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://instagram.com/${settings.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border-2 border-primary/50 flex items-center justify-center"
                  >
                    <Instagram className="h-5 w-5 text-primary" />
                  </a>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 pt-14 md:pt-16 pb-20 md:pb-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
      
      {/* Footer - Hidden on mobile (replaced by bottom nav) */}
      <footer className="hidden md:block border-t border-primary/20 mt-auto bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <div className="mb-4">
                <Logo size="xl" />
              </div>
              <p className="text-primary font-bold text-sm tracking-wide mb-2">
                Every Strand Matters
              </p>
              <p className="text-foreground/60 mb-6 max-w-md leading-relaxed">
                Premium hairstyling for men and women.
              </p>
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '905338709271').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all"
                  aria-label="WhatsApp"
                >
                  <Phone className="h-4 w-4 text-primary" />
                </a>
                <a
                  href={`https://instagram.com/${settings.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 text-primary" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-sm tracking-[0.2em] uppercase text-primary font-bold mb-6">Explore</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-foreground/60 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-sm tracking-[0.2em] uppercase text-primary font-bold mb-6">Contact</h4>
              <address className="not-italic space-y-3 text-foreground/60">
                <p className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>{settings.address}</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{settings.phone}</span>
                </p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-primary/20 mt-8 pt-6 flex justify-between items-center">
            <p className="text-sm text-foreground/50">
              © {new Date().getFullYear()} La'Couronne. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link to="/policies" className="text-sm text-foreground/50 hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link to="/policies" className="text-sm text-foreground/50 hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Mobile Bottom Navigation */}
      <MobileNav />
      
      {/* Promotional Popup Messages */}
      <PromoPopup />
    </div>
  );
}
