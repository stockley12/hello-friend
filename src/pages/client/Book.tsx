import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isSameDay, parseISO } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, MessageCircle, Sparkles, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { BookingFormData } from '@/types';
import bookHeroBg from '@/assets/book-hero-bg.jpg';

const steps = ['Your Details', 'Pick Date & Time'];

// Available time slots (8am, 12pm, 4pm - each appointment is 4 hours)
const TIME_SLOTS = ['08:00', '12:00', '16:00'];
const MAX_APPOINTMENTS_PER_DAY = 3;

export function Book() {
  const navigate = useNavigate();
  const { bookings, addBooking, addClient, clients, generateWhatsAppLink, settings } = useSalon();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BookingFormData>({
    services: [],
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
  
  // Get available slots for selected date
  const availableSlots = useMemo(() => {
    if (!formData.date) return [];
    
    const selectedDate = parseISO(formData.date);
    
    // Get bookings for the selected date
    const dayBookings = bookings.filter(booking => {
      const bookingDate = parseISO(booking.date);
      return isSameDay(bookingDate, selectedDate);
    });
    
    // Get booked times for that day
    const bookedTimes = dayBookings.map(b => b.startTime);
    
    // Filter out booked slots
    return TIME_SLOTS.filter(slot => !bookedTimes.includes(slot));
  }, [formData.date, bookings]);
  
  // Check if day is fully booked
  const isDayFullyBooked = (date: Date) => {
    const dayBookings = bookings.filter(booking => {
      const bookingDate = parseISO(booking.date);
      return isSameDay(bookingDate, date);
    });
    return dayBookings.length >= MAX_APPOINTMENTS_PER_DAY;
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.clientName && formData.clientPhone;
      case 1: return formData.date && formData.time;
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
    
    // Each appointment is 4 hours
    const [hours, minutes] = formData.time.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + 240; // 4 hours = 240 minutes
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;
    
    const booking = addBooking({
      clientId: client!.id,
      staffId: formData.staffId,
      services: [],
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
    services: [],
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
      <div className="min-h-screen py-20 md:py-32 relative">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bookHeroBg})` }}
        />
        <div className="fixed inset-0 bg-background/60 backdrop-blur-[2px]" />
        <div className="container mx-auto px-4 max-w-lg relative z-10">
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
                <p className="text-muted-foreground text-sm">Date & Time</p>
                <p className="font-medium text-foreground">{format(new Date(formData.date), 'EEEE, d MMMM yyyy')} at {formData.time}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Duration</p>
                <p className="font-medium text-foreground">4 hours</p>
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[35vh] md:h-[40vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bookHeroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        <div className="relative h-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-2">
              Book Your Session
            </h1>
            <p className="text-muted-foreground">Transform your look with us</p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form Section */}
      <div className="container mx-auto px-4 max-w-2xl py-8 pb-40 md:pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium tracking-wide text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground">
              {steps[currentStep]}
            </h2>
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
            {/* Step 1: Your Details */}
            {currentStep === 0 && (
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
                  <Label className="text-foreground font-medium">WhatsApp Phone Number *</Label>
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
              </div>
            )}
            
            {/* Step 2: Date & Time */}
            {currentStep === 1 && (
              <div className="space-y-8">
                {/* Info Banner */}
                <div className="glass-card rounded-xl p-4 flex items-start gap-3 bg-primary/5 border-primary/20">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Booking Information</p>
                    <p className="text-muted-foreground">Each session is 4 hours. We accept maximum 3 appointments per day. Sessions start at 8:00 AM, 12:00 PM, or 4:00 PM.</p>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="glass-card rounded-2xl p-4">
                    <Calendar
                      mode="single"
                      selected={formData.date ? new Date(formData.date) : undefined}
                      onSelect={(date) => date && setFormData(p => ({ ...p, date: format(date, 'yyyy-MM-dd'), time: '' }))}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || date.getDay() === 0 || isDayFullyBooked(date);
                      }}
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
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                      {availableSlots.map(slot => (
                        <Button
                          key={slot}
                          variant={formData.time === slot ? 'default' : 'outline'}
                          onClick={() => setFormData(p => ({ ...p, time: slot }))}
                          className={`h-16 rounded-xl font-medium text-lg ${
                            formData.time === slot 
                              ? 'btn-premium' 
                              : 'border-foreground/20 hover:border-primary hover:text-primary'
                          }`}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {formData.date && availableSlots.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="glass-card rounded-xl p-6 bg-destructive/10 border-destructive/20 inline-flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-destructive" />
                      <p className="text-foreground font-medium">This day is fully booked. Please select another date.</p>
                    </div>
                  </motion.div>
                )}
                
                {/* Summary */}
                {formData.date && formData.time && (
                  <div className="glass-card rounded-xl p-6 space-y-3">
                    <h3 className="font-medium text-foreground mb-4">Booking Summary</h3>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium text-foreground">{formData.clientName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium text-foreground">{format(new Date(formData.date), 'EEE, d MMM yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium text-foreground">{formData.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">4 hours</span>
                    </div>
                  </div>
                )}
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
