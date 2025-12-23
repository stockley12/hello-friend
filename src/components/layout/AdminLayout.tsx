import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  ClipboardList, 
  Users, 
  Scissors, 
  Settings, 
  LogOut,
  Menu,
  Clock,
  X,
  Crown,
  Image
} from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { haptics } from '@/lib/haptics';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: ClipboardList },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/availability', label: 'Availability', icon: Clock },
  { href: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

// Mobile bottom nav - most important items
const mobileNavItems = [
  { href: '/admin/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: ClipboardList },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/availability', label: 'Hours', icon: Clock },
  { href: '/admin/settings', label: 'More', icon: Menu },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { settings, logoutAdmin, bookings } = useSalon();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  
  const handleLogout = () => {
    haptics.medium();
    logoutAdmin();
    navigate('/admin/login');
  };
  
  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return location.pathname === '/admin/dashboard';
    return location.pathname.startsWith(href);
  };
  
  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:flex md:flex-col bg-card border-r border-border">
        <div className="p-5 border-b border-border">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-foreground">{settings.name}</span>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-3 space-y-1" aria-label="Admin navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {item.href === '/admin/bookings' && pendingCount > 0 && (
                  <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                    active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/20 text-primary'
                  }`}>
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <header 
        className="md:hidden sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Crown className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">{settings.name}</span>
          </Link>
          
          {pendingCount > 0 && (
            <Link 
              to="/admin/bookings"
              className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold"
            >
              <ClipboardList className="w-4 h-4" />
              {pendingCount}
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/60 z-50"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="md:hidden fixed right-0 top-0 bottom-0 w-72 bg-card z-50 border-l border-border"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-bold text-lg text-foreground">Menu</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(false)}
                className="rounded-full text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => { haptics.light(); setSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-semibold transition-all ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card"
              style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
            >
              <Button
                variant="destructive"
                className="w-full h-12 text-base font-semibold"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        </>
      )}
      
      {/* Main Content */}
      <main className="md:ml-64 min-h-[100dvh]">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4 pb-24 md:pb-6"
        >
          {children}
        </motion.div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex justify-around items-center h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isMoreButton = item.label === 'More';
            
            return (
              <button
                key={item.href}
                onClick={() => {
                  haptics.light();
                  if (isMoreButton) {
                    setSidebarOpen(true);
                  } else {
                    navigate(item.href);
                  }
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full py-2 rounded-xl mx-1 transition-all ${
                  active && !isMoreButton
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className={`h-6 w-6 ${active && !isMoreButton ? 'text-primary' : ''}`} />
                <span className={`text-xs mt-1 font-medium ${active && !isMoreButton ? 'text-primary' : ''}`}>
                  {item.label}
                </span>
                {item.href === '/admin/bookings' && pendingCount > 0 && (
                  <span className="absolute -top-1 right-1/4 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
