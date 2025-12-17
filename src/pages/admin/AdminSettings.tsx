import { useState, useEffect } from 'react';
import { Save, Palette, MessageCircle, Clock, Building2 } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { WorkingHours } from '@/types';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function AdminSettings() {
  const { settings, updateSettings } = useSalon();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: settings.name,
    address: settings.address,
    phone: settings.phone,
    email: settings.email,
    whatsappNumber: settings.whatsappNumber,
    instagramHandle: settings.instagramHandle,
    whatsappTemplate: settings.whatsappTemplate,
    adminPin: settings.adminPin,
    businessHours: { ...settings.businessHours },
  });

  const handleSave = () => {
    updateSettings(formData);
    toast({ title: 'Settings saved', description: 'Your changes have been saved successfully.' });
  };

  const toggleDay = (day: string) => {
    setFormData(p => ({
      ...p,
      businessHours: { ...p.businessHours, [day]: p.businessHours[day] ? null : { start: '09:00', end: '18:00' } }
    }));
  };

  const updateHours = (day: string, field: 'start' | 'end', value: string) => {
    setFormData(p => ({
      ...p,
      businessHours: { ...p.businessHours, [day]: { ...(p.businessHours[day] || { start: '09:00', end: '18:00' }), [field]: value } }
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold">Settings</h1>
        <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
      </div>

      {/* Salon Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Salon Information</CardTitle>
          <CardDescription>Basic details about your salon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><Label>Salon Name</Label><Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></div>
            <div><Label>Phone</Label><Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} /></div>
            <div><Label>Email</Label><Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} /></div>
            <div><Label>Instagram Handle</Label><Input value={formData.instagramHandle} onChange={e => setFormData(p => ({ ...p, instagramHandle: e.target.value }))} placeholder="@yoursalon" /></div>
          </div>
          <div><Label>Address</Label><Textarea value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} /></div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Business Hours</CardTitle>
          <CardDescription>Set your salon's operating hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {days.map(day => (
              <div key={day} className="flex items-center gap-3">
                <Checkbox checked={!!formData.businessHours[day]} onCheckedChange={() => toggleDay(day)} />
                <span className="w-24 capitalize font-medium">{day}</span>
                {formData.businessHours[day] ? (
                  <>
                    <Input type="time" value={formData.businessHours[day]?.start} onChange={e => updateHours(day, 'start', e.target.value)} className="w-32" />
                    <span className="text-muted-foreground">to</span>
                    <Input type="time" value={formData.businessHours[day]?.end} onChange={e => updateHours(day, 'end', e.target.value)} className="w-32" />
                  </>
                ) : <span className="text-muted-foreground">Closed</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" />WhatsApp Integration</CardTitle>
          <CardDescription>Configure WhatsApp booking confirmation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>WhatsApp Number (no + or spaces)</Label>
            <Input value={formData.whatsappNumber} onChange={e => setFormData(p => ({ ...p, whatsappNumber: e.target.value }))} placeholder="13105550100" />
            <p className="text-xs text-muted-foreground mt-1">Used for wa.me links. Format: country code + number</p>
          </div>
          <div>
            <Label>Message Template</Label>
            <Textarea 
              value={formData.whatsappTemplate} 
              onChange={e => setFormData(p => ({ ...p, whatsappTemplate: e.target.value }))} 
              rows={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Available placeholders: {'{clientName}'}, {'{serviceName}'}, {'{date}'}, {'{time}'}, {'{id}'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Admin panel access settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Admin PIN</Label>
            <Input type="password" value={formData.adminPin} onChange={e => setFormData(p => ({ ...p, adminPin: e.target.value }))} className="max-w-xs" />
            <p className="text-xs text-muted-foreground mt-1">Used to access the admin panel</p>
          </div>
        </CardContent>
      </Card>

      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" />Brand Colors</CardTitle>
          <CardDescription>Your salon's color palette (derived from design system)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-primary shadow-md" />
              <p className="text-xs mt-1 text-muted-foreground">Primary Gold</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-foreground shadow-md" />
              <p className="text-xs mt-1 text-muted-foreground">Charcoal</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-background border shadow-md" />
              <p className="text-xs mt-1 text-muted-foreground">Cream</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-muted shadow-md" />
              <p className="text-xs mt-1 text-muted-foreground">Muted</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-lg bg-accent shadow-md" />
              <p className="text-xs mt-1 text-muted-foreground">Accent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Save Button for Mobile */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t md:hidden">
        <Button onClick={handleSave} className="w-full"><Save className="mr-2 h-4 w-4" />Save Changes</Button>
      </div>
    </div>
  );
}
