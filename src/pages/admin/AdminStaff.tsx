import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { WorkingHours } from '@/types';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function AdminStaff() {
  const { staff, services, addStaff, updateStaff, deleteStaff } = useSalon();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', title: '', avatar: '', bio: '',
    servicesOffered: [] as string[],
    workingHours: Object.fromEntries(days.map(d => [d, d === 'sunday' ? null : { start: '09:00', end: '18:00' }])) as WorkingHours,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateStaff(editId, formData);
    } else {
      addStaff(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '', title: '', avatar: '', bio: '',
      servicesOffered: [],
      workingHours: Object.fromEntries(days.map(d => [d, d === 'sunday' ? null : { start: '09:00', end: '18:00' }])) as WorkingHours,
    });
    setEditId(null);
    setIsOpen(false);
  };

  const openEdit = (id: string) => {
    const member = staff.find(s => s.id === id);
    if (member) {
      setFormData({ name: member.name, title: member.title, avatar: member.avatar, bio: member.bio || '', servicesOffered: member.servicesOffered, workingHours: member.workingHours });
      setEditId(id);
      setIsOpen(true);
    }
  };

  const toggleDay = (day: string) => {
    setFormData(p => ({
      ...p,
      workingHours: { ...p.workingHours, [day]: p.workingHours[day] ? null : { start: '09:00', end: '18:00' } }
    }));
  };

  const updateHours = (day: string, field: 'start' | 'end', value: string) => {
    setFormData(p => ({
      ...p,
      workingHours: { ...p.workingHours, [day]: { ...(p.workingHours[day] || { start: '09:00', end: '18:00' }), [field]: value } }
    }));
  };

  const toggleService = (serviceId: string) => {
    setFormData(p => ({
      ...p,
      servicesOffered: p.servicesOffered.includes(serviceId)
        ? p.servicesOffered.filter(id => id !== serviceId)
        : [...p.servicesOffered, serviceId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold">Staff</h1>
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsOpen(true); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Staff</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Staff Member</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Name *</Label><Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required /></div>
              <div><Label>Title *</Label><Input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required placeholder="e.g., Senior Stylist" /></div>
              <div><Label>Avatar URL</Label><Input value={formData.avatar} onChange={e => setFormData(p => ({ ...p, avatar: e.target.value }))} placeholder="https://..." /></div>
              <div><Label>Bio</Label><Textarea value={formData.bio} onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))} /></div>
              
              <div>
                <Label className="mb-2 block">Working Hours</Label>
                <div className="space-y-2">
                  {days.map(day => (
                    <div key={day} className="flex items-center gap-2">
                      <Checkbox checked={!!formData.workingHours[day]} onCheckedChange={() => toggleDay(day)} />
                      <span className="w-24 capitalize text-sm">{day}</span>
                      {formData.workingHours[day] ? (
                        <>
                          <Input type="time" value={formData.workingHours[day]?.start} onChange={e => updateHours(day, 'start', e.target.value)} className="w-28 h-8" />
                          <span>-</span>
                          <Input type="time" value={formData.workingHours[day]?.end} onChange={e => updateHours(day, 'end', e.target.value)} className="w-28 h-8" />
                        </>
                      ) : <span className="text-sm text-muted-foreground">Day off</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Services Offered</Label>
                <div className="grid grid-cols-2 gap-2">
                  {services.filter(s => s.active).map(service => (
                    <div key={service.id} className="flex items-center gap-2">
                      <Checkbox checked={formData.servicesOffered.includes(service.id)} onCheckedChange={() => toggleService(service.id)} />
                      <span className="text-sm">{service.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">{editId ? 'Update' : 'Add'} Staff Member</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {staff.map(member => (
          <Card key={member.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-lg">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-primary">{member.title}</p>
                  {member.bio && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{member.bio}</p>}
                  <p className="text-xs text-muted-foreground mt-2">{member.servicesOffered.length} services</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(member.id)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteStaff(member.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
