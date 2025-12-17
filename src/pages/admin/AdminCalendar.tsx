import { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AdminCalendar() {
  const { bookings, staff, getClientById, getServiceById, getStaffById, generateWhatsAppLink } = useSalon();
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

  return (
    <div className="space-y-6">
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
                              <a href={generateWhatsAppLink(booking)} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4 text-muted-foreground hover:text-primary" />
                              </a>
                            </div>
                            <p className="text-xs text-muted-foreground">{booking.startTime} - {booking.endTime}</p>
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
