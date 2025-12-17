import { useState } from 'react';
import { Plus, Pencil, Trash2, Clock, DollarSign } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceCategory } from '@/types';

const categories: { value: ServiceCategory; label: string }[] = [
  { value: 'cut', label: 'Cuts' },
  { value: 'color', label: 'Color' },
  { value: 'treatment', label: 'Treatments' },
  { value: 'styling', label: 'Styling' },
  { value: 'extensions', label: 'Extensions' },
];

export function AdminServices() {
  const { services, addService, updateService, deleteService } = useSalon();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', category: 'cut' as ServiceCategory, durationMin: 30, price: 50, description: '', active: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateService(editId, formData);
    } else {
      addService(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'cut', durationMin: 30, price: 50, description: '', active: true });
    setEditId(null);
    setIsOpen(false);
  };

  const openEdit = (id: string) => {
    const service = services.find(s => s.id === id);
    if (service) {
      setFormData({ name: service.name, category: service.category, durationMin: service.durationMin, price: service.price, description: service.description, active: service.active });
      setEditId(id);
      setIsOpen(true);
    }
  };

  const groupedServices = categories.map(cat => ({
    ...cat,
    services: services.filter(s => s.category === cat.value),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold">Services</h1>
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsOpen(true); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Add Service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Service</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Name *</Label><Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required /></div>
              <div><Label>Category</Label>
                <Select value={formData.category} onValueChange={(v: ServiceCategory) => setFormData(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Duration (min)</Label><Input type="number" value={formData.durationMin} onChange={e => setFormData(p => ({ ...p, durationMin: parseInt(e.target.value) || 0 }))} /></div>
                <div><Label>Price ($)</Label><Input type="number" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: parseInt(e.target.value) || 0 }))} /></div>
              </div>
              <div><Label>Description</Label><Textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} /></div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch checked={formData.active} onCheckedChange={checked => setFormData(p => ({ ...p, active: checked }))} />
              </div>
              <Button type="submit" className="w-full">{editId ? 'Update' : 'Add'} Service</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {groupedServices.map(group => (
        <div key={group.value}>
          <h2 className="text-lg font-medium mb-3">{group.label}</h2>
          {group.services.length === 0 ? (
            <p className="text-sm text-muted-foreground mb-4">No services in this category</p>
          ) : (
            <div className="grid gap-3 mb-6">
              {group.services.map(service => (
                <Card key={service.id} className={!service.active ? 'opacity-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{service.name}</span>
                          {!service.active && <Badge variant="secondary">Inactive</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{service.description}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{service.durationMin} min</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />${service.price}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(service.id)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteService(service.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
