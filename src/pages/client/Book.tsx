import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, Clock, MessageCircle } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { useAvailability, useStaffAvailableForServices } from '@/hooks/useAvailability';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BookingFormData } from '@/types';

const steps = ['Services', 'Stylist', 'Date & Time', 'Details', 'Confirm'];

const formatPrice = (price: number) => `₺${price.toLocaleString('tr-TR')}`;

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
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.services.length > 0;
      case 1: return true;
      case 2: return formData.date && formData.time;
      case 3: return formData.clientName && formData.clientPhone;
      case 4: return true;
      default: return false;
    }
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
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
            <h1 className="font-display text-4xl font-light mb-4">Booking Confirmed</h1>
            <p className="text-foreground/60 mb-10 font-light">
              Please confirm via WhatsApp to secure your appointment.
            </p>
            
            <div className="glass-dark rounded-2xl p-8 mb-8 text-left space-y-4">
              <div>
                <p className="text-foreground/40 text-sm">Services</p>
                <p className="font-light">{formData.services.map(id => getServiceById(id)?.name).join(', ')}</p>
              </div>
              <div>
                <p className="text-foreground/40 text-sm">Date & Time</p>
                <p className="font-light">{format(new Date(formData.date), 'EEEE, d MMMM yyyy')} at {formData.time}</p>
              </div>
              <div>
                <p className="text-foreground/40 text-sm">Total</p>
                <p className="text-2xl font-light">{formatPrice(totalPrice)}</p>
              </div>
            </div>
            
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full btn-premium h-16 text-lg rounded-full mb-4">
                <MessageCircle className="mr-3 h-6 w-6" />
                Confirm on WhatsApp
              </Button>
            </a>
            
            <Button variant="ghost" onClick={() => navigate('/')} className="text-foreground/60">
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
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-sm tracking-[0.2em] uppercase mb-4">Step {currentStep + 1} of {steps.length}</p>
            <h1 className="font-display text-4xl md:text-5xl font-light">
              {steps[currentStep]}
            </h1>
          </motion.div>
        </div>
        
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentStep ? 'w-12 bg-primary' : index < currentStep ? 'w-4 bg-primary' : 'w-4 bg-white/20'
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
              <div className="space-y-4">
                {activeServices.map(service => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceToggle(service.id)}
                    className={`glass-dark rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                      formData.services.includes(service.id) ? 'border-primary glow-gold' : 'hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-light mb-1">{service.name}</h3>
                        <p className="text-foreground/50 text-sm font-light">{service.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-light">{formatPrice(service.price)}</p>
                        <p className="text-foreground/40 text-sm">{service.durationMin} min</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.services.length > 0 && (
                  <div className="glass-dark rounded-xl p-6 flex justify-between items-center">
                    <div>
                      <p className="text-foreground/40 text-sm">Total</p>
                      <p className="text-2xl font-light">{formatPrice(totalPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground/40 text-sm">Duration</p>
                      <p className="font-light">{totalDuration} min</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Step 2: Stylist */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div
                  onClick={() => setFormData(p => ({ ...p, staffId: undefined }))}
                  className={`glass-dark rounded-xl p-6 cursor-pointer transition-all ${
                    !formData.staffId ? 'border-primary glow-gold' : 'hover:border-white/30'
                  }`}
                >
                  <h3 className="font-display text-xl font-light">No Preference</h3>
                  <p className="text-foreground/50 text-sm font-light">We'll assign the best available stylist</p>
                </div>
                
                {availableStaff.map(member => (
                  <div
                    key={member.id}
                    onClick={() => setFormData(p => ({ ...p, staffId: member.id }))}
                    className={`glass-dark rounded-xl p-6 cursor-pointer transition-all flex items-center gap-4 ${
                      formData.staffId === member.id ? 'border-primary glow-gold' : 'hover:border-white/30'
                    }`}
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-display text-xl font-light">{member.name}</h3>
                      <p className="text-primary text-sm">{member.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Step 3: Date & Time */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={(date) => date && setFormData(p => ({ ...p, date: format(date, 'yyyy-MM-dd'), time: '' }))}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-xl border border-white/10 bg-card/50"
                  />
                </div>
                
                {formData.date && availableSlots.length > 0 && (
                  <div>
                    <h3 className="font-display text-xl font-light mb-4 text-center">Available Times</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableSlots.map(slot => (
                        <Button
                          key={slot.time}
                          variant={formData.time === slot.time ? 'default' : 'outline'}
                          disabled={!slot.available}
                          onClick={() => setFormData(p => ({ ...p, time: slot.time }))}
                          className={`h-12 rounded-full ${formData.time === slot.time ? 'btn-premium' : 'border-white/20'}`}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Step 4: Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-foreground/60 font-light">Full Name *</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData(p => ({ ...p, clientName: e.target.value }))}
                    className="h-14 bg-card/50 border-white/10 rounded-xl mt-2"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label className="text-foreground/60 font-light">Phone *</Label>
                  <Input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData(p => ({ ...p, clientPhone: e.target.value }))}
                    className="h-14 bg-card/50 border-white/10 rounded-xl mt-2"
                    placeholder="+90 5XX XXX XXXX"
                  />
                </div>
                <div>
                  <Label className="text-foreground/60 font-light">Email</Label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(p => ({ ...p, clientEmail: e.target.value }))}
                    className="h-14 bg-card/50 border-white/10 rounded-xl mt-2"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label className="text-foreground/60 font-light">Special Requests</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                    className="bg-card/50 border-white/10 rounded-xl mt-2"
                    placeholder="Any notes for your stylist..."
                  />
                </div>
              </div>
            )}
            
            {/* Step 5: Confirm */}
            {currentStep === 4 && (
              <div className="glass-dark rounded-2xl p-8 space-y-6">
                <h3 className="font-display text-2xl font-light text-center mb-6">Booking Summary</h3>
                
                <div className="space-y-4 py-6 border-y border-white/10">
                  <div className="flex justify-between">
                    <span className="text-foreground/50 font-light">Services</span>
                    <span className="font-light text-right">{formData.services.map(id => getServiceById(id)?.name).join(', ')}</span>
                  </div>
                  {formData.staffId && (
                    <div className="flex justify-between">
                      <span className="text-foreground/50 font-light">Stylist</span>
                      <span className="font-light">{staff.find(s => s.id === formData.staffId)?.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-foreground/50 font-light">Date</span>
                    <span className="font-light">{format(new Date(formData.date), 'EEEE, d MMMM yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/50 font-light">Time</span>
                    <span className="font-light">{formData.time}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xl">
                  <span className="font-light">Total</span>
                  <span className="font-display text-gradient-gold">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <p className="font-light">{formData.clientName}</p>
                  <p className="text-foreground/50 text-sm font-light">{formData.clientPhone}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation */}
        <div className="fixed bottom-24 md:bottom-0 left-0 right-0 p-4 glass-dark md:relative md:mt-12 md:p-0 md:bg-transparent md:backdrop-blur-none md:border-0">
          <div className="flex gap-4 max-w-2xl mx-auto">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack} className="flex-1 h-14 rounded-full border-white/20">
                <ChevronLeft className="mr-2 h-5 w-5" />Back
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="flex-1 h-14 btn-premium rounded-full">
                Continue<ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1 h-14 btn-premium rounded-full">
                Confirm Booking<Check className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
