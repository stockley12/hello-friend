import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSalon } from '@/contexts/SalonContext';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { WelcomePopup } from '@/components/WelcomePopup';
import { InstallPrompt } from '@/components/InstallPrompt';
import { BookingAlert } from '@/components/BookingAlert';
import { AnimatePresence } from 'framer-motion';

// Clear old cached data on version update (but keep admin auth!)
const APP_VERSION = '2.2.0';
const storedVersion = localStorage.getItem('app_version');
if (storedVersion !== APP_VERSION) {
  // Clear settings to get new WhatsApp number, but KEEP admin auth
  localStorage.removeItem('lacouronne_settings');
  // Don't remove admin auth - user should stay logged in
  localStorage.setItem('app_version', APP_VERSION);
}

// Client Pages
import { Home } from '@/pages/client/Home';
import { Services } from '@/pages/client/Services';
import { Book } from '@/pages/client/Book';
import { Gallery } from '@/pages/client/Gallery';
import { About } from '@/pages/client/About';
import { Contact } from '@/pages/client/Contact';
import { Policies } from '@/pages/client/Policies';

// Admin Pages
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminCalendar } from '@/pages/admin/AdminCalendar';
import { AdminBookings } from '@/pages/admin/AdminBookings';
import { AdminClients } from '@/pages/admin/AdminClients';
import { AdminServices } from '@/pages/admin/AdminServices';
import { AdminStaff } from '@/pages/admin/AdminStaff';
import { AdminSettings } from '@/pages/admin/AdminSettings';
import { AdminAvailability } from '@/pages/admin/AdminAvailability';
import { AdminGallery } from '@/pages/admin/AdminGallery';

const queryClient = new QueryClient();

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated } = useSalon();
  if (!isAdminAuthenticated) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

// Global booking alert that auto-dismisses
function GlobalBookingAlert() {
  const { bookingAlert, clearBookingAlert } = useSalon();
  
  useEffect(() => {
    if (bookingAlert) {
      // Auto-clear after 6 seconds
      const timer = setTimeout(() => {
        clearBookingAlert();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [bookingAlert, clearBookingAlert]);
  
  return (
    <AnimatePresence>
      {bookingAlert && (
        <BookingAlert
          clientName={bookingAlert.clientName}
          date={bookingAlert.date}
          time={bookingAlert.time}
          onClose={clearBookingAlert}
        />
      )}
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/" element={<ClientLayout><Home /></ClientLayout>} />
      <Route path="/services" element={<ClientLayout><Services /></ClientLayout>} />
      <Route path="/gallery" element={<ClientLayout><Gallery /></ClientLayout>} />
      <Route path="/book" element={<ClientLayout><Book /></ClientLayout>} />
      <Route path="/about" element={<ClientLayout><About /></ClientLayout>} />
      <Route path="/contact" element={<ClientLayout><Contact /></ClientLayout>} />
      <Route path="/policies" element={<ClientLayout><Policies /></ClientLayout>} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
      <Route path="/admin/calendar" element={<ProtectedAdminRoute><AdminCalendar /></ProtectedAdminRoute>} />
      <Route path="/admin/bookings" element={<ProtectedAdminRoute><AdminBookings /></ProtectedAdminRoute>} />
      <Route path="/admin/clients" element={<ProtectedAdminRoute><AdminClients /></ProtectedAdminRoute>} />
      <Route path="/admin/services" element={<ProtectedAdminRoute><AdminServices /></ProtectedAdminRoute>} />
      <Route path="/admin/staff" element={<ProtectedAdminRoute><AdminStaff /></ProtectedAdminRoute>} />
      <Route path="/admin/availability" element={<ProtectedAdminRoute><AdminAvailability /></ProtectedAdminRoute>} />
      <Route path="/admin/gallery" element={<ProtectedAdminRoute><AdminGallery /></ProtectedAdminRoute>} />
      <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <WelcomePopup />
        <InstallPrompt />
        <GlobalBookingAlert />
        <Toaster />
        <Sonner />
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
