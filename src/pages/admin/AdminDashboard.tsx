import { format } from 'date-fns';
import { Calendar, DollarSign, Clock, AlertTriangle, Plus, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AdminDashboard() {
  const { bookings, services, clients, getClientById, getServiceById, generateWhatsAppLink } = useSalon();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayBookings = bookings.filter(b => b.date === today && b.status !== 'cancelled');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  
  const todayRevenue = todayBookings.reduce((acc, b) => {
    return acc + b.services.reduce((sum, id) => sum + (getServiceById(id)?.price || 0), 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        <Link to="/admin/bookings">
          <Button><Plus className="mr-2 h-4 w-4" />New Booking</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div><p className="text-2xl font-semibold">{todayBookings.length}</p><p className="text-xs text-muted-foreground">Today's Bookings</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary" />
            <div><p className="text-2xl font-semibold">${todayRevenue}</p><p className="text-xs text-muted-foreground">Today's Revenue</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-primary" />
            <div><p className="text-2xl font-semibold">{pendingBookings.length}</p><p className="text-xs text-muted-foreground">Pending</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <div><p className="text-2xl font-semibold">0</p><p className="text-xs text-muted-foreground">Alerts</p></div>
          </div>
        </CardContent></Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader><CardTitle>Today's Schedule</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {todayBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No bookings today</p>
          ) : (
            todayBookings.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(booking => {
              const client = getClientById(booking.clientId);
              const serviceNames = booking.services.map(id => getServiceById(id)?.name).filter(Boolean).join(', ');
              return (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="font-semibold">{booking.startTime}</p>
                      <p className="text-xs text-muted-foreground">{booking.endTime}</p>
                    </div>
                    <div>
                      <p className="font-medium">{client?.name || 'Guest'}</p>
                      <p className="text-sm text-muted-foreground">{serviceNames}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>{booking.status}</Badge>
                    <a href={generateWhatsAppLink(booking)} target="_blank" rel="noopener noreferrer">
                      <Button size="icon" variant="ghost"><MessageCircle className="h-4 w-4" /></Button>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
