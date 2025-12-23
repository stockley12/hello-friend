import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  Check, 
  X, 
  Clock, 
  Phone,
  Calendar,
  User,
  Bell,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send
} from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingStatus, Booking } from '@/types';
import { 
  generateConfirmationLink, 
  generateCancellationLink, 
  generateReminderLink,
  openWhatsApp 
} from '@/lib/whatsapp';
import { haptics } from '@/lib/haptics';

const statusConfig: Record<BookingStatus, { 
  color: string; 
  bgColor: string;
  icon: React.ReactNode;
  label: string;
}> = {
  pending: { 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-50 border-amber-200',
    icon: <Clock className="w-4 h-4" />,
    label: 'Pending'
  },
  confirmed: { 
    color: 'text-green-600', 
    bgColor: 'bg-green-50 border-green-200',
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: 'Confirmed'
  },
  completed: { 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50 border-blue-200',
    icon: <Check className="w-4 h-4" />,
    label: 'Completed'
  },
  cancelled: { 
    color: 'text-red-600', 
    bgColor: 'bg-red-50 border-red-200',
    icon: <XCircle className="w-4 h-4" />,
    label: 'Cancelled'
  },
  'no-show': { 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50 border-gray-200',
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'No-show'
  },
};

export function AdminBookings() {
  const { 
    bookings, 
    getClientById, 
    getServiceById, 
    getStaffById, 
    updateBookingStatus, 
    settings 
  } = useSalon();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');

  const today = format(new Date(), 'yyyy-MM-dd');

  // Count pending bookings for badge
  const pendingCount = useMemo(() => 
    bookings.filter(b => b.status === 'pending').length
  , [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings
      .filter(b => {
        if (statusFilter !== 'all' && b.status !== statusFilter) return false;
        if (dateFilter === 'today' && b.date !== today) return false;
        if (dateFilter === 'upcoming' && b.date < today) return false;
        if (dateFilter === 'past' && b.date >= today) return false;
        if (search) {
          const client = getClientById(b.clientId);
          const searchLower = search.toLowerCase();
          if (!client?.name.toLowerCase().includes(searchLower) && 
              !client?.phone.includes(search) &&
              !b.id.toLowerCase().includes(searchLower)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Pending first, then by date
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return a.startTime.localeCompare(b.startTime);
      });
  }, [bookings, statusFilter, dateFilter, search, today, getClientById]);

  // Handle Accept booking - opens WhatsApp confirmation
  const handleAcceptBooking = async (booking: Booking) => {
    haptics.success();
    const client = getClientById(booking.clientId);
    
    if (!client) {
      console.error('Client not found');
      return;
    }
    
    // Update status to confirmed
    await updateBookingStatus(booking.id, 'confirmed');
    
    // Generate and open WhatsApp confirmation link
    const whatsappData = generateConfirmationLink(booking, client, settings);
    openWhatsApp(whatsappData.link);
  };

  // Handle Reject booking - opens WhatsApp cancellation
  const handleRejectBooking = async (booking: Booking) => {
    haptics.warning();
    const client = getClientById(booking.clientId);
    
    if (!client) {
      console.error('Client not found');
      return;
    }
    
    // Update status to cancelled
    await updateBookingStatus(booking.id, 'cancelled');
    
    // Generate and open WhatsApp cancellation link
    const whatsappData = generateCancellationLink(booking, client, settings);
    openWhatsApp(whatsappData.link);
  };

  // Handle sending reminder
  const handleSendReminder = (booking: Booking) => {
    haptics.medium();
    const client = getClientById(booking.clientId);
    
    if (!client) {
      console.error('Client not found');
      return;
    }
    
    const whatsappData = generateReminderLink(booking, client, settings);
    openWhatsApp(whatsappData.link);
  };

  // Handle marking as completed
  const handleMarkCompleted = async (booking: Booking) => {
    haptics.success();
    await updateBookingStatus(booking.id, 'completed');
  };

  // Handle marking as no-show
  const handleMarkNoShow = async (booking: Booking) => {
    haptics.warning();
    await updateBookingStatus(booking.id, 'no-show');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage appointments and send WhatsApp confirmations
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Badge className="bg-amber-500 text-white animate-pulse">
              {pendingCount} pending
            </Badge>
          )}
          <Badge variant="outline">{filteredBookings.length} total</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search client, phone, ID..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-10" 
          />
        </div>
        <Select value={statusFilter} onValueChange={(v: BookingStatus | 'all') => setStatusFilter(v)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">⏳ Pending</SelectItem>
            <SelectItem value="confirmed">✅ Confirmed</SelectItem>
            <SelectItem value="completed">🎉 Completed</SelectItem>
            <SelectItem value="cancelled">❌ Cancelled</SelectItem>
            <SelectItem value="no-show">👻 No-show</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={(v: string) => setDateFilter(v)}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No bookings found</p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking, index) => {
              const client = getClientById(booking.clientId);
              const staffMember = getStaffById(booking.staffId || '');
              const services = booking.services.map(id => getServiceById(id)?.name).filter(Boolean);
              const status = statusConfig[booking.status];
              const isPending = booking.status === 'pending';
              const isConfirmed = booking.status === 'confirmed';

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className={`overflow-hidden border-2 transition-all ${
                    isPending ? 'border-amber-300 shadow-amber-100 shadow-md' : 'border-transparent'
                  }`}>
                    <CardContent className="p-0">
                      {/* Status Bar */}
                      <div className={`px-4 py-2 flex items-center gap-2 ${status.bgColor} border-b`}>
                        <span className={status.color}>{status.icon}</span>
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          #{booking.id.slice(-6)}
                        </span>
                      </div>

                      <div className="p-4">
                        {/* Client Info */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-semibold truncate">
                                {client?.name || 'Guest'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span>{client?.phone || 'No phone'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                            <p className="font-medium">
                              {format(new Date(booking.date), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Time</p>
                            <p className="font-medium">
                              {booking.startTime} - {booking.endTime}
                            </p>
                          </div>
                          {staffMember && (
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider">Stylist</p>
                              <p className="font-medium">{staffMember.name}</p>
                            </div>
                          )}
                          {services.length > 0 && (
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider">Services</p>
                              <p className="font-medium">{services.join(', ')}</p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {isPending && (
                          <div className="space-y-2">
                            {/* Show where WhatsApp will be sent */}
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                              <MessageCircle className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-green-700 dark:text-green-400">
                                WhatsApp will send to: <strong>{client?.phone || 'No phone'}</strong>
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleAcceptBooking(booking)}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Accept & Send
                                <MessageCircle className="w-4 h-4 ml-2" />
                              </Button>
                              <Button
                                onClick={() => handleRejectBooking(booking)}
                                variant="destructive"
                                className="flex-1"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}

                        {isConfirmed && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSendReminder(booking)}
                              variant="outline"
                              className="flex-1"
                            >
                              <Bell className="w-4 h-4 mr-2" />
                              Send Reminder
                              <Send className="w-3 h-3 ml-2" />
                            </Button>
                            <Button
                              onClick={() => handleMarkCompleted(booking)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Complete
                            </Button>
                            <Button
                              onClick={() => handleMarkNoShow(booking)}
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-red-600"
                              title="Mark as no-show"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {(booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'no-show') && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                const client = getClientById(booking.clientId);
                                if (client) {
                                  const whatsappData = generateConfirmationLink(booking, client, settings);
                                  openWhatsApp(whatsappData.link);
                                }
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message Client
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* WhatsApp Info Banner */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">WhatsApp Notifications</h3>
              <p className="text-sm text-green-700 mt-1">
                When you Accept or Reject a booking, WhatsApp will open with a pre-written message 
                to the customer. Just click <strong>Send</strong> to notify them instantly!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
