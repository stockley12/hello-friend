import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { useAvailability } from '@/hooks/useAvailability';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { BookingFormData } from '@/types';

const steps = ['Choose Service', 'Pick Date & Time', 'Your Details'];



export function Book() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { services, addBooking, addClient, clients, generateWhatsAppLink, getServiceById } = useSalon();
  
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
  
  const availableSlots = useAvailability(formData.date, formData.staffId, formData.services);
  
  const totalDuration = useMemo(() => {
    return formData.services.reduce((acc, id) => {
      const service = services.find(s => s.id === id);
      return acc + (service?.durationMin || 0);
    }, 0);
  }, [formData.services, services]);
  
  
  const activeServices = services.filter(s => s.active);
  
  const handleServiceSelect = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: [serviceId], // Single service selection for simplicity
    }));
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.services.length > 0;
      case 1: return formData.date && formData.time;
      case 2: return formData.clientName && formData.clientPhone;
      default: return false;
    }
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
    else handleSubmit();
  };
  
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = () => {
    let client = clients.find(c => c.phone === formData.clientPhone);
    if (!client) {
      client = addClient({
        name: formData.clientName,
        phone: formData.clientPhone,
        email: formData.clientEmail,
        notes: '',
        tags: ['New'],
      }) as any;
    }
    
    const [hours, minutes] = formData.time.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + totalDuration;
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;
    
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
    clientId: clients.find(c => c.phone === formData.clientPhone)?.id || '',
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
    
    return (
      <div className="min-h-screen py-20 md:py-32">
        <div className="container mx-auto px-4 max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-medium mb-4 text-foreground">Booking Confirmed!</h1>
            <p className="text-muted-foreground mb-10 font-light">
              Confirm via WhatsApp to secure your appointment.
            </p>
            
            <div className="glass-card rounded-2xl p-8 mb-8 text-left space-y-4">
              <div>
                <p className="text-muted-foreground text-sm">Service</p>
                <p className="font-medium text-foreground">{formData.services.map(id => getServiceById(id)?.name).join(', ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Date & Time</p>
                <p className="font-medium text-foreground">{format(new Date(formData.date), 'EEEE, d MMMM yyyy')} at {formData.time}</p>
              </div>
            </div>
            
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full btn-premium h-16 text-lg rounded-full mb-4">
                <MessageCircle className="mr-3 h-6 w-6" />
                Confirm on WhatsApp
              </Button>
            </a>
            
            <Button variant="ghost" onClick={() => navigate('/')} className="text-muted-foreground">
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 md:py-20 pb-40 md:pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium tracking-wide text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground">
              {steps[currentStep]}
            </h1>
          </motion.div>
        </div>
        
        {/* Progress */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === currentStep ? 'w-16 bg-primary' : index < currentStep ? 'w-8 bg-primary' : 'w-8 bg-foreground/10'
              }`}
            />
          ))}
        </div>
        
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Services */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeServices.map(service => (
                  <motion.div
                    key={service.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleServiceSelect(service.id)}
                    className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                      formData.services.includes(service.id) 
                        ? 'ring-2 ring-primary glow-gold' 
                        : 'hover:shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <span className="text-xs font-medium tracking-wide text-primary uppercase mb-2">
                        {service.category}
                      </span>
                      <h3 className="font-display text-xl font-medium mb-2 text-foreground">{service.name}</h3>
                      <p className="text-muted-foreground text-sm flex-1 mb-4">{service.description}</p>
                      <div className="flex items-center justify-end pt-4 border-t border-foreground/10">
                        <span className="text-muted-foreground text-sm">{service.durationMin} min</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Step 2: Date & Time */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="flex justify-center">
                  <div className="glass-card rounded-2xl p-4">
                    <Calendar
                      mode="single"
                      selected={formData.date ? new Date(formData.date) : undefined}
                      onSelect={(date) => date && setFormData(p => ({ ...p, date: format(date, 'yyyy-MM-dd'), time: '' }))}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                
                {formData.date && availableSlots.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="font-display text-xl font-medium mb-4 text-center text-foreground">Available Times</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableSlots.map(slot => (
                        <Button
                          key={slot.time}
                          variant={formData.time === slot.time ? 'default' : 'outline'}
                          disabled={!slot.available}
                          onClick={() => setFormData(p => ({ ...p, time: slot.time }))}
                          className={`h-12 rounded-full font-medium ${
                            formData.time === slot.time 
                              ? 'btn-premium' 
                              : 'border-foreground/20 hover:border-primary hover:text-primary'
                          }`}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {formData.date && availableSlots.length === 0 && (
                  <p className="text-center text-muted-foreground">No available slots for this date. Please try another day.</p>
                )}
              </div>
            )}
            
            {/* Step 3: Details */}
            {currentStep === 2 && (
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <div>
                  <Label className="text-foreground font-medium">Your Name *</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData(p => ({ ...p, clientName: e.target.value }))}
                    className="h-14 bg-background border-foreground/10 rounded-xl mt-2"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label className="text-foreground font-medium">Phone Number *</Label>
                  <Input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData(p => ({ ...p, clientPhone: e.target.value }))}
                    className="h-14 bg-background border-foreground/10 rounded-xl mt-2"
                    placeholder="+90 5XX XXX XXXX"
                  />
                </div>
                <div>
                  <Label className="text-foreground font-medium">Email (optional)</Label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(p => ({ ...p, clientEmail: e.target.value }))}
                    className="h-14 bg-background border-foreground/10 rounded-xl mt-2"
                    placeholder="your@email.com"
                  />
                </div>
                
                {/* Summary */}
                <div className="pt-6 mt-6 border-t border-foreground/10 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground">{formData.services.map(id => getServiceById(id)?.name).join(', ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{format(new Date(formData.date), 'EEE, d MMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{formData.time}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation */}
        <div className="fixed bottom-24 md:bottom-0 left-0 right-0 p-4 glass md:relative md:mt-10 md:p-0 md:bg-transparent md:backdrop-blur-none md:border-0">
          <div className="flex gap-4 max-w-2xl mx-auto">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="flex-1 h-14 rounded-full border-foreground/20 text-foreground hover:bg-foreground/5"
              >
                <ChevronLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 h-14 rounded-full btn-premium disabled:opacity-50"
            >
              {currentStep === steps.length - 1 ? 'Confirm Booking' : 'Continue'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
