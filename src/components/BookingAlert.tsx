import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { playNotificationSound } from '@/lib/notifications';

interface BookingAlertProps {
  clientName: string;
  date: string;
  time: string;
  onClose: () => void;
}

export function BookingAlert({ clientName, date, time, onClose }: BookingAlertProps) {
  useEffect(() => {
    // Play sound when alert appears
    playNotificationSound();
    
    // Auto-dismiss after 6 seconds - NO CLICK NEEDED
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] pointer-events-auto"
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 shadow-2xl shadow-green-500/30 border border-green-400/30">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Bell className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-lg">🎉 New Booking!</p>
            <p className="text-white/90 text-sm mt-1">
              <span className="font-semibold">{clientName}</span> booked for
            </p>
            <p className="text-white font-medium">
              {date} at {time}
            </p>
          </div>
        </div>
        
        {/* Auto-dismiss progress bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white/60 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 6, ease: 'linear' }}
          />
        </div>
        <p className="text-white/60 text-xs mt-1 text-center">Auto-dismissing...</p>
      </div>
    </motion.div>
  );
}

// Hook to manage booking alerts
export function useBookingAlerts() {
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    clientName: string;
    date: string;
    time: string;
  }>>([]);

  const showAlert = (clientName: string, date: string, time: string) => {
    const id = `alert-${Date.now()}`;
    setAlerts(prev => [...prev, { id, clientName, date, time }]);
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return { alerts, showAlert, dismissAlert };
}








