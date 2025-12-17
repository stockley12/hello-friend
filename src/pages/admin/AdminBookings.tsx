import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Filter, MessageCircle, MoreVertical, Check, X, Clock } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookingStatus } from '@/types';

const statusColors: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-gray-100 text-gray-800',
};

export function AdminBookings() {
  const { bookings, getClientById, getServiceById, getStaffById, updateBookingStatus, generateWhatsAppLink } = useSalon();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');

  const today = format(new Date(), 'yyyy-MM-dd');

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
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return a.startTime.localeCompare(b.startTime);
      });
  }, [bookings, statusFilter, dateFilter, search, today, getClientById]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold">Bookings</h1>
        <Badge variant="outline">{filteredBookings.length} bookings</Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search client, phone, ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={(v: BookingStatus | 'all') => setStatusFilter(v)}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no-show">No-show</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Date" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No bookings found</CardContent></Card>
        ) : (
          filteredBookings.map(booking => {
            const client = getClientById(booking.clientId);
            const staffMember = getStaffById(booking.staffId || '');
            const services = booking.services.map(id => getServiceById(id)?.name).filter(Boolean);
            const total = booking.services.reduce((acc, id) => acc + (getServiceById(id)?.price || 0), 0);

            return (
              <Card key={booking.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{client?.name || 'Guest'}</span>
                        <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{services.join(', ')}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                        <span>{format(new Date(booking.date), 'MMM d, yyyy')}</span>
                        <span>{booking.startTime} - {booking.endTime}</span>
                        {staffMember && <span>with {staffMember.name}</span>}
                        <span className="font-medium text-foreground">${total}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <a href={generateWhatsAppLink(booking)} target="_blank" rel="noopener noreferrer">
                        <Button size="icon" variant="ghost"><MessageCircle className="h-4 w-4" /></Button>
                      </a>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'confirmed')}>
                            <Check className="mr-2 h-4 w-4" />Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'completed')}>
                            <Check className="mr-2 h-4 w-4" />Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'no-show')}>
                            <Clock className="mr-2 h-4 w-4" />No-show
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, 'cancelled')} className="text-destructive">
                            <X className="mr-2 h-4 w-4" />Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
