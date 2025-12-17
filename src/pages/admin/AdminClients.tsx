import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Plus, Phone, Mail, MoreVertical, Tag, User } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function AdminClients() {
  const { clients, bookings, addClient, updateClient, getServiceById } = useSalon();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '', tags: '' });

  const filteredClients = useMemo(() => {
    if (!search) return clients;
    const searchLower = search.toLowerCase();
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchLower) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(searchLower)
    );
  }, [clients, search]);

  const getClientBookings = (clientId: string) => {
    return bookings.filter(b => b.clientId === clientId).sort((a, b) => b.date.localeCompare(a.date));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (selectedClient) {
      updateClient(selectedClient, { ...formData, tags });
    } else {
      addClient({ ...formData, tags });
    }
    setFormData({ name: '', phone: '', email: '', notes: '', tags: '' });
    setIsAddOpen(false);
    setSelectedClient(null);
  };

  const openEdit = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData({ name: client.name, phone: client.phone, email: client.email, notes: client.notes, tags: client.tags.join(', ') });
      setSelectedClient(clientId);
      setIsAddOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold">Clients</h1>
        <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) { setSelectedClient(null); setFormData({ name: '', phone: '', email: '', notes: '', tags: '' }); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{selectedClient ? 'Edit' : 'Add'} Client</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Name *</Label><Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required /></div>
              <div><Label>Phone *</Label><Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} required /></div>
              <div><Label>Email</Label><Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} /></div>
              <div><Label>Tags (comma separated)</Label><Input value={formData.tags} onChange={e => setFormData(p => ({ ...p, tags: e.target.value }))} placeholder="VIP, Regular" /></div>
              <div><Label>Notes</Label><Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} /></div>
              <Button type="submit" className="w-full">{selectedClient ? 'Update' : 'Add'} Client</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="grid gap-4">
        {filteredClients.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">No clients found</CardContent></Card>
        ) : (
          filteredClients.map(client => {
            const clientBookings = getClientBookings(client.id);
            const totalSpent = clientBookings.reduce((acc, b) => acc + b.services.reduce((sum, id) => sum + (getServiceById(id)?.price || 0), 0), 0);
            
            return (
              <Card key={client.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{client.name}</span>
                          {client.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{client.phone}</span>
                          {client.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{client.email}</span>}
                        </div>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span><strong>{clientBookings.length}</strong> visits</span>
                          <span><strong>${totalSpent}</strong> total</span>
                        </div>
                        {client.notes && <p className="text-sm text-muted-foreground mt-2 italic">"{client.notes}"</p>}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(client.id)}>Edit</Button>
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
