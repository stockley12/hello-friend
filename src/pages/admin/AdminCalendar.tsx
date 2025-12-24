import { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay, differenceInDays, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, MessageCircle, Bell, Clock, User, Phone } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateConfirmationLink, openWhatsApp } from '@/lib/whatsapp';

export function AdminCalendar() {
  const { bookings, staff, clients, getClientById, getServiceById, getStaffById, settings } = useSalon();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end: addDays(start, 6) });
  }, [currentDate]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (b.status === 'cancelled') return false;
      if (selectedStaff !== 'all' && b.staffId !== selectedStaff) return false;
      if (view === 'day') return b.date === format(currentDate, 'yyyy-MM-dd');
      return weekDays.some(d => b.date === format(d, 'yyyy-MM-dd'));
    });
  }, [bookings, currentDate, view, selectedStaff, weekDays]);

  // Calculate clients who haven't booked in over 30 days
  const followUpReminders = useMemo(() => {
    const today = new Date();
    const clientLastBooking: Record<string, { date: Date; booking: typeof bookings[0] }> = {};
    
    // Find the most recent booking for each client
    bookings.forEach(booking => {
      if (booking.status === 'cancelled') return;
      const bookingDate = parseISO(booking.date);
      if (!clientLastBooking[booking.clientId] || bookingDate > clientLastBooking[booking.clientId].date) {
        clientLastBooking[booking.clientId] = { date: bookingDate, booking };
      }
    });
    
    // Filter clients whose last booking was more than 30 days ago
    const reminders = clients
      .filter(client => {
        const lastBooking = clientLastBooking[client.id];
        if (!lastBooking) return false; // No previous bookings
        const daysSinceLastBooking = differenceInDays(today, lastBooking.date);
        return daysSinceLastBooking >= 30;
      })
      .map(client => {
        const lastBooking = clientLastBooking[client.id];
        const daysSince = differenceInDays(today, lastBooking.date);
        return {
          client,
          lastBookingDate: lastBooking.date,
          daysSince,
          lastBooking: lastBooking.booking,
        };
      })
      .sort((a, b) => b.daysSince - a.daysSince); // Sort by longest time since booking
    
    return reminders;
  }, [bookings, clients]);

  const timeSlots = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  const getBookingForSlot = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredBookings.filter(b => {
      if (b.date !== dateStr) return false;
      const bookingStart = parseInt(b.startTime.split(':')[0]);
      const bookingEnd = parseInt(b.endTime.split(':')[0]);
      const slotHour = parseInt(time.split(':')[0]);
      return slotHour >= bookingStart && slotHour < bookingEnd;
    });
  };

  const navigate = (direction: number) => {
    setCurrentDate(prev => addDays(prev, direction * (view === 'week' ? 7 : 1)));
  };

  const sendFollowUpWhatsApp = (client: typeof clients[0]) => {
    const salonPhone = (settings.whatsappNumber || '905338709271').replace(/\D/g, '');
    const message = `Hi ${client.name}! 👋

It's been a while since your last visit to La'Couronne! We miss you! 💇✨

Ready for a fresh new look? Book your next appointment today!

📱 Call us or book online
🎁 Special offer for returning clients!

See you soon! 💕`;
    
    const clientPhone = client.phone.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${clientPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Follow-up Reminders Section */}
      {followUpReminders.length > 0 && (
        <Card className="border-2 border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  Follow-up Reminders
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-700">
                    {followUpReminders.length}
                  </Badge>
                </CardTitle>
                <CardDescription>Clients who haven't booked in over 30 days</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {followUpReminders.slice(0, 5).map(({ client, daysSince, lastBookingDate }) => (
                <div 
                  key={client.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-amber-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{client.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{daysSince} days ago</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{format(lastBookingDate, 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-shrink-0 gap-2 border-green-500/50 text-green-600 hover:bg-green-500/10 hover:text-green-600"
                    onClick={() => sendFollowUpWhatsApp(client)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Message</span>
                  </Button>
                </div>
              ))}
              {followUpReminders.length > 5 && (
                <p className="text-center text-sm text-muted-foreground pt-2">
                  +{followUpReminders.length - 5} more clients need follow-up
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold">Calendar</h1>
        <div className="flex items-center gap-2">
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All Staff" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staff.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={view} onValueChange={(v: 'day' | 'week') => setView(v)}>
            <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ChevronLeft className="h-5 w-5" /></Button>
            <CardTitle className="text-lg">
              {view === 'day' 
                ? format(currentDate, 'EEEE, MMMM d, yyyy')
                : `${format(weekDays[0], 'MMM d')} - ${format(weekDays[6], 'MMM d, yyyy')}`}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => navigate(1)}><ChevronRight className="h-5 w-5" /></Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {view === 'day' ? (
            <div className="min-w-[300px]">
              {timeSlots.map(time => {
                const slotBookings = getBookingForSlot(currentDate, time);
                return (
                  <div key={time} className="flex border-t border-border min-h-[60px]">
                    <div className="w-16 p-2 text-sm text-muted-foreground flex-shrink-0 border-r border-border">{time}</div>
                    <div className="flex-1 p-1 space-y-1">
                      {slotBookings.map(booking => {
                        const client = getClientById(booking.clientId);
                        const staffMember = getStaffById(booking.staffId || '');
                        return (
                          <div key={booking.id} className="bg-primary/10 border-l-4 border-primary rounded p-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{client?.name}</span>
                              <button 
                                onClick={() => {
                                  if (client) {
                                    const whatsappData = generateConfirmationLink(booking, client, settings);
                                    openWhatsApp(whatsappData.link);
                                  }
                                }}
                                className="hover:opacity-80"
                                title={`Send WhatsApp to ${client?.phone || 'client'}`}
                              >
                                <MessageCircle className="h-4 w-4 text-green-600 hover:text-green-500" />
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
                            <p className="text-xs text-green-600">📱 {client?.phone}</p>
                            {staffMember && <p className="text-xs text-muted-foreground">with {staffMember.name}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="min-w-[700px]">
              <div className="grid grid-cols-8 border-b border-border">
                <div className="p-2 border-r border-border" />
                {weekDays.map(day => (
                  <div key={day.toISOString()} className={`p-2 text-center text-sm ${isSameDay(day, new Date()) ? 'bg-primary/10' : ''}`}>
                    <div className="font-medium">{format(day, 'EEE')}</div>
                    <div className="text-muted-foreground">{format(day, 'd')}</div>
                  </div>
                ))}
              </div>
              {timeSlots.map(time => (
                <div key={time} className="grid grid-cols-8 border-b border-border min-h-[50px]">
                  <div className="p-1 text-xs text-muted-foreground border-r border-border">{time}</div>
                  {weekDays.map(day => {
                    const slotBookings = getBookingForSlot(day, time);
                    return (
                      <div key={day.toISOString()} className="p-0.5 border-r border-border last:border-r-0">
                        {slotBookings.map(b => (
                          <div key={b.id} className="bg-primary/20 rounded px-1 text-xs truncate">
                            {getClientById(b.clientId)?.name?.split(' ')[0]}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
