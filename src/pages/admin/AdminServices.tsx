import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Clock, Sparkles } from 'lucide-react';
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
import { ServiceCategory, ServiceGender } from '@/types';
import { haptics } from '@/lib/haptics';
import { User, Users } from 'lucide-react';

const categories: { value: ServiceCategory; label: string }[] = [
  { value: 'braids', label: 'Braids' },
  { value: 'twists', label: 'Twists' },
  { value: 'locs', label: 'Locs' },
  { value: 'natural', label: 'Natural Hair' },
  { value: 'mens', label: 'Mens' },
  { value: 'cut', label: 'Cuts' },
  { value: 'color', label: 'Color' },
  { value: 'treatment', label: 'Treatments' },
  { value: 'styling', label: 'Styling' },
  { value: 'extensions', label: 'Extensions' },
];

const genderOptions: { value: ServiceGender; label: string; icon: string }[] = [
  { value: 'female', label: 'Women Only', icon: '👑' },
  { value: 'male', label: 'Men Only', icon: '👔' },
  { value: 'both', label: 'Everyone', icon: '✨' },
];

export function AdminServices() {
  const { services, addService, updateService, deleteService } = useSalon();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    category: 'braids' as ServiceCategory,
    gender: 'female' as ServiceGender,
    durationMin: 240, 
    price: 2000, 
    description: '', 
    active: true 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    haptics.success();
    if (editId) {
      updateService(editId, formData);
    } else {
      addService(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', category: 'braids', gender: 'female', durationMin: 240, price: 2000, description: '', active: true });
    setEditId(null);
    setIsOpen(false);
  };

  const openEdit = (id: string) => {
    haptics.light();
    const service = services.find(s => s.id === id);
    if (service) {
      setFormData({ 
        name: service.name, 
        category: service.category,
        gender: service.gender || 'both', // Default to 'both' for existing services
        durationMin: service.durationMin, 
        price: service.price, 
        description: service.description, 
        active: service.active 
      });
      setEditId(id);
      setIsOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    haptics.warning();
    if (confirm('Delete this service?')) {
      deleteService(id);
    }
  };

  const groupedServices = categories
    .map(cat => ({
      ...cat,
      services: services.filter(s => s.category === cat.value),
    }))
    .filter(group => group.services.length > 0);

  const totalServices = services.length;
  const activeServices = services.filter(s => s.active).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Services</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {activeServices} active of {totalServices} services
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsOpen(true); }}>
          <DialogTrigger asChild>
            <Button size="lg" className="w-full sm:w-auto h-12 text-base font-bold">
              <Plus className="mr-2 h-5 w-5" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="text-xl">{editId ? 'Edit' : 'Add New'} Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Service Name *</Label>
                <Input 
                  value={formData.name} 
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} 
                  placeholder="e.g., Knotless Braids"
                  className="h-12 text-base mt-2"
                  required 
                />
              </div>
              
              <div>
                <Label className="text-base font-semibold">Category</Label>
                <Select value={formData.category} onValueChange={(v: ServiceCategory) => setFormData(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="h-12 text-base mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.value} value={c.value} className="text-base py-3">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Gender Selection */}
              <div>
                <Label className="text-base font-semibold">For Who? *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {genderOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, gender: option.value }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        formData.gender === option.value
                          ? option.value === 'female' 
                            ? 'border-pink-500 bg-pink-500/10'
                            : option.value === 'male'
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <p className={`text-xs font-medium mt-1 ${
                        formData.gender === option.value ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {option.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-base font-semibold">Duration</Label>
                  <div className="relative mt-2">
                    <Input 
                      type="number" 
                      value={formData.durationMin} 
                      onChange={e => setFormData(p => ({ ...p, durationMin: parseInt(e.target.value) || 0 }))} 
                      className="h-12 text-base pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">min</span>
                  </div>
                </div>
                <div>
                  <Label className="text-base font-semibold">Price</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₺</span>
                    <Input 
                      type="number" 
                      value={formData.price} 
                      onChange={e => setFormData(p => ({ ...p, price: parseInt(e.target.value) || 0 }))} 
                      className="h-12 text-base pl-8"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-base font-semibold">Description</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
                  placeholder="Describe the service..."
                  className="mt-2 min-h-[80px] text-base"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div>
                  <Label className="text-base font-semibold">Active</Label>
                  <p className="text-sm text-muted-foreground">Show on booking page</p>
                </div>
                <Switch 
                  checked={formData.active} 
                  onCheckedChange={checked => setFormData(p => ({ ...p, active: checked }))} 
                />
              </div>
              
              <Button type="submit" className="w-full h-12 text-base font-bold">
                {editId ? 'Update Service' : 'Add Service'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services by Category */}
      {groupedServices.length === 0 ? (
        <Card className="border-2 border-dashed border-border">
          <CardContent className="py-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">No services yet</p>
            <p className="text-sm text-muted-foreground">Add your first service to get started</p>
          </CardContent>
        </Card>
      ) : (
        groupedServices.map((group, groupIndex) => (
          <motion.div 
            key={group.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-lg font-bold text-primary">{group.label}</h2>
              <Badge variant="secondary" className="text-xs">
                {group.services.length}
              </Badge>
            </div>
            
            {/* Services Grid */}
            <div className="grid gap-3 mb-6">
              {group.services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`overflow-hidden transition-all ${
                    !service.active ? 'opacity-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Service Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-lg text-foreground">{service.name}</span>
                            {/* Gender Badge */}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                service.gender === 'female' 
                                  ? 'border-pink-500 text-pink-500 bg-pink-500/10'
                                  : service.gender === 'male'
                                    ? 'border-blue-500 text-blue-500 bg-blue-500/10'
                                    : 'border-primary text-primary bg-primary/10'
                              }`}
                            >
                              {service.gender === 'female' ? '👑 Women' : service.gender === 'male' ? '👔 Men' : '✨ All'}
                            </Badge>
                            {!service.active && (
                              <Badge variant="secondary" className="text-xs">Inactive</Badge>
                            )}
                          </div>
                          
                          {service.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {service.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {service.durationMin >= 60 
                                ? `${Math.floor(service.durationMin / 60)}h ${service.durationMin % 60 > 0 ? `${service.durationMin % 60}m` : ''}`
                                : `${service.durationMin}m`
                              }
                            </span>
                            <span className="font-bold text-primary">
                              ₺{service.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="h-10 w-10"
                            onClick={() => openEdit(service.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            className="h-10 w-10 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}
