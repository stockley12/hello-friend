import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, Clock, MessageCircle } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { useAvailability, useStaffAvailableForServices } from '@/hooks/useAvailability';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { BookingFormData } from '@/types';

const steps = ['Services', 'Stylist', 'Date & Time', 'Your Details', 'Confirm'];

export function Book() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { services, staff, addBooking, addClient, clients, generateWhatsAppLink, getServiceById } = useSalon();
  
  const preSelectedService = searchParams.get('service');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BookingFormData>({
    services: preSelectedService ? [preSelectedService] : [],
    staffId: undefined,
    date: '',
    time: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: '',
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);
  
  const availableStaff = useStaffAvailableForServices(formData.services);
  const availableSlots = useAvailability(formData.date, formData.staffId, formData.services);
  
  const totalDuration = useMemo(() => {
    return formData.services.reduce((acc, id) => {
      const service = services.find(s => s.id === id);
      return acc + (service?.durationMin || 0);
    }, 0);
  }, [formData.services, services]);
  
  const totalPrice = useMemo(() => {
    return formData.services.reduce((acc, id) => {
      const service = services.find(s => s.id === id);
      return acc + (service?.price || 0);
    }, 0);
  }, [formData.services, services]);
  
  const activeServices = services.filter(s => s.active);
  
  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId],
    }));
  };
  
  const handleStaffSelect = (staffId: string | undefined) => {
    setFormData(prev => ({ ...prev, staffId }));
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ 
        ...prev, 
        date: format(date, 'yyyy-MM-dd'),
        time: '', // Reset time when date changes
      }));
    }
  };
  
  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.services.length > 0;
      case 1: return true; // Staff is optional
      case 2: return formData.date && formData.time;
      case 3: return formData.clientName && formData.clientPhone && formData.clientEmail;
      case 4: return true;
      default: return false;
    }
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = () => {
    // Integration point: This would be an API call to create booking
    // Find or create client
    let client = clients.find(c => c.email === formData.clientEmail);
    if (!client) {
      client = addClient({
        name: formData.clientName,
        phone: formData.clientPhone,
        email: formData.clientEmail,
        notes: '',
        tags: ['New'],
      }) as any;
    }
    
    // Calculate end time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + totalDuration;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;
    
    // Create booking
    const booking = addBooking({
      clientId: client!.id,
      staffId: formData.staffId,
      services: formData.services,
      date: formData.date,
      startTime: formData.time,
      endTime,
      status: 'pending',
      notes: formData.notes || '',
    });
    
    setCreatedBookingId(booking.id);
    setBookingComplete(true);
  };
  
  const createdBooking = createdBookingId ? {
    id: createdBookingId,
    clientId: clients.find(c => c.email === formData.clientEmail)?.id || '',
    staffId: formData.staffId,
    services: formData.services,
    date: formData.date,
    startTime: formData.time,
    endTime: '',
    status: 'pending' as const,
    notes: formData.notes || '',
    createdAt: new Date().toISOString(),
  } : null;
  
  if (bookingComplete && createdBooking) {
    const whatsappLink = generateWhatsAppLink(createdBooking);
    const selectedServices = formData.services.map(id => getServiceById(id)?.name).filter(Boolean);
    const selectedStaff = staff.find(s => s.id === formData.staffId);
    
    return (
      <div className="min-h-screen py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-semibold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-8">
              Your appointment has been scheduled. Please confirm via WhatsApp.
            </p>
            
            <Card className="card-premium mb-6 text-left">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Services</p>
                  <p className="font-medium">{selectedServices.join(', ')}</p>
                </div>
                {selectedStaff && (
                  <div>
                    <p className="text-sm text-muted-foreground">Stylist</p>
                    <p className="font-medium">{selectedStaff.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {format(new Date(formData.date), 'EEEE, MMMM d, yyyy')} at {formData.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-mono text-sm">{createdBookingId}</p>
                </div>
              </CardContent>
            </Card>
            
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full btn-luxury h-14 text-lg mb-4">
                <MessageCircle className="mr-2 h-5 w-5" />
                Confirm on WhatsApp
              </Button>
            </a>
            
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8 md:py-12 pb-32 md:pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">
            Book Your Appointment
          </h1>
          <p className="text-muted-foreground">
            {steps[currentStep]}
          </p>
        </div>
        
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-primary'
                  : index < currentStep
                  ? 'w-2 bg-primary'
                  : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
        
        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Services */}
            {currentStep === 0 && (
              <div className="space-y-4">
                {activeServices.map(service => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all ${
                      formData.services.includes(service.id)
                        ? 'ring-2 ring-primary bg-accent/30'
                        : 'hover:bg-accent/10'
                    }`}
                    onClick={() => handleServiceToggle(service.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <Checkbox
                        checked={formData.services.includes(service.id)}
                        className="pointer-events-none"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${service.price}</p>
                        <p className="text-sm text-muted-foreground">{service.durationMin} min</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {formData.services.length > 0 && (
                  <div className="bg-accent/30 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-semibold text-lg">${totalPrice}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{totalDuration} min</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Step 2: Stylist */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Card
                  className={`cursor-pointer transition-all ${
                    !formData.staffId ? 'ring-2 ring-primary bg-accent/30' : 'hover:bg-accent/10'
                  }`}
                  onClick={() => handleStaffSelect(undefined)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">No Preference</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll assign the best available stylist
                    </p>
                  </CardContent>
                </Card>
                
                {availableStaff.map(member => (
                  <Card
                    key={member.id}
                    className={`cursor-pointer transition-all ${
                      formData.staffId === member.id
                        ? 'ring-2 ring-primary bg-accent/30'
                        : 'hover:bg-accent/10'
                    }`}
                    onClick={() => handleStaffSelect(member.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-primary">{member.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{member.bio}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Step 3: Date & Time */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-lg border"
                  />
                </div>
                
                {formData.date && (
                  <div>
                    <h3 className="font-medium mb-3">Available Times</h3>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {availableSlots.map(slot => (
                          <Button
                            key={slot.time}
                            variant={formData.time === slot.time ? 'default' : 'outline'}
                            disabled={!slot.available}
                            onClick={() => handleTimeSelect(slot.time)}
                            className="h-12"
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No available slots for this date. Please select another date.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Step 4: Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.clientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                    placeholder="Your name"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                    placeholder="+1 555 123 4567"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="your@email.com"
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Special Requests (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special requests or notes..."
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            {/* Step 5: Confirm */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Card className="card-premium">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-display text-xl font-semibold">Booking Summary</h3>
                    
                    <div className="space-y-3 py-4 border-y border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Services</span>
                        <span className="font-medium text-right">
                          {formData.services.map(id => getServiceById(id)?.name).join(', ')}
                        </span>
                      </div>
                      {formData.staffId && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stylist</span>
                          <span className="font-medium">
                            {staff.find(s => s.id === formData.staffId)?.name}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">
                          {format(new Date(formData.date), 'EEEE, MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">{formData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{totalDuration} min</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">${totalPrice}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-border space-y-2">
                      <p className="font-medium">{formData.clientName}</p>
                      <p className="text-sm text-muted-foreground">{formData.clientPhone}</p>
                      <p className="text-sm text-muted-foreground">{formData.clientEmail}</p>
                      {formData.notes && (
                        <p className="text-sm text-muted-foreground italic">"{formData.notes}"</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <p className="text-sm text-muted-foreground text-center">
                  By confirming, you agree to our cancellation policy. Payment is due at the salon.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation */}
        <div className="fixed bottom-20 md:bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:relative md:mt-8 md:border-0 md:p-0 md:bg-transparent">
          <div className="flex gap-3 max-w-3xl mx-auto">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack} className="flex-1 h-12">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 h-12 btn-luxury"
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 h-12 btn-luxury"
              >
                Confirm Booking
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
