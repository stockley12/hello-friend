import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { Check, ChevronLeft, ChevronRight, MessageCircle, Sparkles, Clock, AlertCircle, User, Phone, Mail, CalendarDays, Timer, Scissors, Crown, CheckCircle2 } from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { BookingFormData, ClientGender, Service } from '@/types';
import { haptics } from '@/lib/haptics';

const bookHeroBg = '/book-hero-bg.png?v=2';

const steps = ['I am a...', 'Select Service', 'Your Details', 'Pick Date & Time'];

// Time slot labels based on hour
const getTimeSlotLabel = (time: string): string => {
  const hour = parseInt(time.split(':')[0]);
  if (hour < 12) return 'Morning';
  if (hour < 15) return 'Afternoon';
  if (hour < 18) return 'Late Afternoon';
  if (hour < 21) return 'Evening';
  return 'Night';
};

// Format price
const formatPrice = (price: number) => `₺${price.toLocaleString('tr-TR')}`;

// Note: Services are now filtered by the 'gender' field on each service
// gender: 'female' | 'male' | 'both'

export function Book() {
  const navigate = useNavigate();
  const { services, addBooking, addClient, clients, settings, getAvailableTimeSlots, getAllTimeSlotsWithStatus, isDayAvailable } = useSalon();
  const formRef = useRef<HTMLDivElement>(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [countryCode, setCountryCode] = useState('+90');
  const [formData, setFormData] = useState<BookingFormData>({
    gender: 'female',
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
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Animation for success checkmark
  const checkProgress = useMotionValue(0);
  const pathLength = useTransform(checkProgress, [0, 1], [0, 1]);

  // Filter services based on gender field
  const availableServices = useMemo(() => {
    return services.filter(s => {
      if (!s.active) return false;
      // Show if service gender matches client gender, or if service is for 'both'
      if (s.gender === 'both') return true;
      return s.gender === formData.gender;
    });
  }, [services, formData.gender]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return formData.services.reduce((sum, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);
  }, [formData.services, services]);

  // Get selected service names
  const selectedServiceNames = useMemo(() => {
    return formData.services
      .map(id => services.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  }, [formData.services, services]);

  useEffect(() => {
    const salonName = settings?.name || "La'Couronne";
    document.title = `Book Braids Appointment | ${salonName}`;
  }, [settings?.name]);
  
  // Scroll to form on step change
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);
  
  // Get available time slots for selected date
  const availableSlots = useMemo(() => {
    if (!formData.date) return [];
    const selectedDate = parseISO(formData.date);
    return getAvailableTimeSlots(selectedDate);
  }, [formData.date, getAvailableTimeSlots]);
  
  // Check if a day is unavailable
  const isDayUnavailable = (date: Date): boolean => {
    if (!isDayAvailable(date)) return true;
    const slots = getAvailableTimeSlots(date);
    return slots.length === 0;
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.gender; // Gender selected
      case 1: return formData.services.length > 0; // At least one service
      case 2: return formData.clientName.trim() && formData.clientPhone.trim();
      case 3: return formData.date && formData.time;
      default: return false;
    }
  };
  
  const handleNext = () => {
    haptics.medium();
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    haptics.light();
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleGenderSelect = (gender: ClientGender) => {
    haptics.selection();
    setFormData(p => ({ ...p, gender, services: [] })); // Reset services when gender changes
  };

  const handleServiceToggle = (serviceId: string) => {
    haptics.selection();
    setFormData(p => ({
      ...p,
      services: p.services.includes(serviceId)
        ? p.services.filter(id => id !== serviceId)
        : [...p.services, serviceId]
    }));
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      haptics.selection();
      setFormData(p => ({ ...p, date: format(date, 'yyyy-MM-dd'), time: '' }));
    }
  };
  
  const handleTimeSelect = (slot: string) => {
    haptics.selection();
    setFormData(p => ({ ...p, time: slot }));
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    haptics.medium();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Full phone number with country code
      const fullPhoneNumber = countryCode.replace('+', '') + formData.clientPhone;
      
      // Find existing client or create new one
      let client = clients.find(c => c.phone.replace(/\D/g, '') === fullPhoneNumber);
      if (!client) {
        client = await addClient({
          name: formData.clientName,
          phone: fullPhoneNumber,
          email: formData.clientEmail,
          notes: `Gender: ${formData.gender === 'female' ? 'Female' : 'Male'}`,
          tags: ['New', formData.gender === 'female' ? 'Women' : 'Men'],
        });
      }
      
      // Calculate end time based on service duration
      const [hours, minutes] = formData.time.split(':').map(Number);
      const totalDuration = formData.services.reduce((sum, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return sum + (service?.durationMin || 60);
      }, 0);
      const endMinutes = hours * 60 + minutes + totalDuration;
      const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`;
      
      // Create booking notes with service details
      const bookingNotes = `Gender: ${formData.gender === 'female' ? 'Female' : 'Male'}\nServices: ${selectedServiceNames}\nTotal: ${formatPrice(totalPrice)}`;
      
      // Create the booking
      const booking = await addBooking({
        clientId: client.id,
        staffId: formData.staffId,
        services: formData.services,
        date: formData.date,
        startTime: formData.time,
        endTime,
        status: 'pending',
        notes: bookingNotes,
      });
      
      setCreatedBookingId(booking.id);
      setCreatedClientId(client.id);
      setBookingComplete(true);
      haptics.success();
      
      animate(checkProgress, 1, { duration: 0.5, delay: 0.2 });
    } catch (error) {
      console.error('Booking failed:', error);
      haptics.error();
      setIsSubmitting(false);
    }
  };
  
  const createdBooking = createdBookingId ? {
    id: createdBookingId,
    clientId: createdClientId || '',  // Use the stored client ID
    staffId: formData.staffId,
    services: formData.services,
    date: formData.date,
    startTime: formData.time,
    endTime: '',
    status: 'pending' as const,
    notes: '',
    createdAt: new Date().toISOString(),
  } : null;
  
  // Success Screen
  if (bookingComplete && createdBooking) {
    // Generate WhatsApp link directly using formData (no lookup needed)
    const salonPhone = (settings.whatsappNumber || '905338709271').replace(/\D/g, '');
    const whatsappMessage = `Hi La'Couronne! 👋

I'd like to confirm my booking:

👤 Name: ${formData.clientName}
💇 Services: ${selectedServiceNames}
💰 Total: ${formatPrice(totalPrice)}
📅 Date: ${format(new Date(formData.date), 'EEEE, d MMMM yyyy')}
⏰ Time: ${formData.time}

Please confirm my appointment. Thank you! 🙏`;
    
    const whatsappLink = `https://wa.me/${salonPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    
    return (
      <div className="min-h-[100dvh] py-20 md:py-32 relative">
        <div className="fixed inset-0">
          <img src={bookHeroBg} alt="" className="h-full w-full object-cover object-top" loading="eager" />
        </div>
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm" />
        
        <div className="container mx-auto px-4 max-w-lg relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            {/* Success Icon */}
            <motion.div 
              className="w-28 h-28 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 relative"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
            >
              <motion.div className="absolute inset-0 rounded-full bg-primary/20" initial={{ scale: 1 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} />
              <svg className="w-14 h-14 text-primary" viewBox="0 0 24 24" fill="none">
                <motion.path d="M4 12L9 17L20 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ pathLength }} />
              </svg>
            </motion.div>
            
            <motion.h1 className="font-display text-3xl md:text-4xl font-semibold mb-3 text-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Booking Confirmed!
            </motion.h1>
            <motion.p className="text-muted-foreground mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Confirm via WhatsApp to secure your spot
            </motion.p>
            
            {/* Booking Details */}
            <motion.div className="glass-card rounded-3xl p-6 mb-6 text-left space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-primary/5">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Client</p>
                  <p className="font-semibold text-foreground">{formData.clientName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-primary/5">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Scissors className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Services</p>
                  <p className="font-semibold text-foreground">{selectedServiceNames}</p>
                  <p className="text-primary font-bold">{formatPrice(totalPrice)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-primary/5">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Date & Time</p>
                  <p className="font-semibold text-foreground">{format(new Date(formData.date), 'EEEE, d MMMM')} at {formData.time}</p>
                </div>
              </div>
            </motion.div>
            
            {/* WhatsApp CTA */}
            <motion.a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="w-full btn-premium h-16 text-lg rounded-full mb-4">
                <MessageCircle className="mr-3 h-6 w-6" />
                Confirm on WhatsApp
              </Button>
            </motion.a>
            
            <Button variant="ghost" onClick={() => navigate('/')} className="text-muted-foreground">
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Hero Section */}
      <section
        className="relative h-[30vh] min-h-[240px] md:h-[40vh] overflow-hidden bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${bookHeroBg})`, backgroundPosition: '20% 25%' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl md:text-4xl font-semibold text-foreground drop-shadow-lg mb-1">
              Book Your Session
            </h1>
            <p className="text-foreground/80 text-sm md:text-base drop-shadow">Transform your look with us</p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <div ref={formRef} className="container mx-auto px-4 max-w-lg py-6 pb-36 md:pb-20">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <motion.div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all ${
                  index <= currentStep ? 'bg-primary text-background' : 'bg-foreground/10 text-muted-foreground'
                }`}
              >
                {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </motion.div>
              {index < steps.length - 1 && (
                <div className={`w-6 md:w-10 h-1 mx-1 rounded-full ${index < currentStep ? 'bg-primary' : 'bg-foreground/10'}`} />
              )}
            </div>
          ))}
        </div>
        
        {/* Step Title */}
        <motion.div className="text-center mb-6" key={`title-${currentStep}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground">{steps[currentStep]}</h2>
        </motion.div>
        
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            {/* Step 1: Gender Selection */}
            {currentStep === 0 && (
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  onClick={() => handleGenderSelect('female')}
                  className={`relative p-6 rounded-3xl border-3 transition-all ${
                    formData.gender === 'female' 
                      ? 'border-pink-500 bg-pink-500/10 shadow-xl shadow-pink-500/20' 
                      : 'border-foreground/10 bg-background/50 hover:border-pink-500/50'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {formData.gender === 'female' && (
                    <motion.div className="absolute top-3 right-3" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="w-6 h-6 text-pink-500" />
                    </motion.div>
                  )}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">Female</h3>
                  <p className="text-sm text-muted-foreground mt-1">Women's Styles</p>
                </motion.button>

                <motion.button
                  onClick={() => handleGenderSelect('male')}
                  className={`relative p-6 rounded-3xl border-3 transition-all ${
                    formData.gender === 'male' 
                      ? 'border-blue-500 bg-blue-500/10 shadow-xl shadow-blue-500/20' 
                      : 'border-foreground/10 bg-background/50 hover:border-blue-500/50'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {formData.gender === 'male' && (
                    <motion.div className="absolute top-3 right-3" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    </motion.div>
                  )}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                    <Scissors className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">Male</h3>
                  <p className="text-sm text-muted-foreground mt-1">Men's Styles</p>
                </motion.button>
              </div>
            )}

            {/* Step 2: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground mb-4">
                  Select the services you want ({formData.gender === 'female' ? "Women's" : "Men's"} styles)
                </p>
                
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                  {availableServices.length > 0 ? (
                    availableServices.map((service, index) => {
                      const isSelected = formData.services.includes(service.id);
                      return (
                        <motion.button
                          key={service.id}
                          onClick={() => handleServiceToggle(service.id)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/10 shadow-lg' 
                              : 'border-foreground/10 bg-background/50 hover:border-primary/50'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                  {service.name}
                                </h3>
                                {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {service.durationMin} min
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                {formatPrice(service.price)}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Scissors className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No services available for this category yet.</p>
                      <p className="text-sm">Please contact us directly.</p>
                    </div>
                  )}
                </div>

                {/* Selected Services Summary */}
                {formData.services.length > 0 && (
                  <motion.div 
                    className="glass-card rounded-2xl p-4 mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{formData.services.length} service(s) selected</p>
                        <p className="text-xs text-muted-foreground">{selectedServiceNames}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            
            {/* Step 3: Client Details */}
            {currentStep === 2 && (
              <div className="glass-card rounded-3xl p-5 md:p-8 space-y-5">
                <div>
                  <Label className="text-foreground font-medium flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    Your Name <span className="text-xs text-destructive">*</span>
                  </Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData(p => ({ ...p, clientName: e.target.value }))}
                    className="h-14 bg-background/50 border-foreground/10 rounded-xl text-base"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label className="text-foreground font-medium flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-primary" />
                    WhatsApp Number <span className="text-xs text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-14 px-3 bg-background/50 border border-foreground/10 rounded-xl text-base text-foreground min-w-[100px]"
                    >
                      <option value="+90">🇹🇷 +90</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+234">🇳🇬 +234</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+27">🇿🇦 +27</option>
                      <option value="+233">🇬🇭 +233</option>
                      <option value="+20">🇪🇬 +20</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+91">🇮🇳 +91</option>
                    </select>
                    <Input
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData(p => ({ ...p, clientPhone: e.target.value.replace(/\D/g, '') }))}
                      className="h-14 bg-background/50 border-foreground/10 rounded-xl text-base flex-1"
                      placeholder="5XX XXX XXXX"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-foreground font-medium flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email <span className="text-xs text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData(p => ({ ...p, clientEmail: e.target.value }))}
                    className="h-14 bg-background/50 border-foreground/10 rounded-xl text-base"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            )}
            
            {/* Step 4: Date & Time */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Selected Services Reminder */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{selectedServiceNames}</p>
                      <p className="text-xs text-muted-foreground">{formData.clientName} • {formData.gender === 'female' ? 'Female' : 'Male'}</p>
                    </div>
                    <p className="text-lg font-bold text-primary">{formatPrice(totalPrice)}</p>
                  </div>
                </div>

                {/* Calendar */}
                <motion.div className="glass-card rounded-3xl p-3 md:p-4">
                  <Calendar
                    mode="single"
                    selected={formData.date ? new Date(formData.date) : undefined}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today || isDayUnavailable(date);
                    }}
                    className="rounded-xl w-full"
                  />
                </motion.div>
                
                {/* Time Slots - Show all slots with availability status */}
                {formData.date && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 className="font-semibold text-foreground mb-2 text-center">Select Time</h3>
                    <p className="text-xs text-muted-foreground text-center mb-4">
                      🟢 Available &nbsp; 🔴 Taken
                    </p>
                    
                    {(() => {
                      const allSlots = getAllTimeSlotsWithStatus(parseISO(formData.date));
                      
                      if (allSlots.length === 0) {
                        return (
                          <div className="text-center py-5 rounded-2xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                            <p className="text-foreground font-semibold">Closed This Day</p>
                            <p className="text-sm text-muted-foreground">Please select another date.</p>
                          </div>
                        );
                      }
                      
                      const hasAvailable = allSlots.some(s => s.available);
                      
                      return (
                        <>
                          <div className="grid grid-cols-3 gap-3">
                            {allSlots.map((slot) => {
                              const isSelected = formData.time === slot.time;
                              const isTaken = !slot.available;
                              
                              return (
                                <motion.button
                                  key={slot.time}
                                  onClick={() => !isTaken && handleTimeSelect(slot.time)}
                                  disabled={isTaken}
                                  className={`relative p-4 rounded-2xl border-2 transition-all ${
                                    isTaken 
                                      ? 'border-red-500/30 bg-red-500/5 cursor-not-allowed opacity-60' 
                                      : isSelected 
                                        ? 'border-primary bg-primary/20 shadow-lg shadow-primary/20' 
                                        : 'border-foreground/10 hover:border-primary/50 bg-background/50'
                                  }`}
                                  whileTap={isTaken ? {} : { scale: 0.95 }}
                                >
                                  {/* Status indicator */}
                                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                                    isTaken ? 'bg-red-500' : 'bg-green-500'
                                  }`} />
                                  
                                  <p className="text-xs text-muted-foreground">{getTimeSlotLabel(slot.time)}</p>
                                  <p className={`text-lg font-bold ${
                                    isTaken ? 'text-red-400' : isSelected ? 'text-primary' : 'text-foreground'
                                  }`}>
                                    {slot.time}
                                  </p>
                                  
                                  {isTaken && (
                                    <p className="text-xs text-red-400 font-medium mt-1">Taken</p>
                                  )}
                                  {!isTaken && isSelected && (
                                    <p className="text-xs text-primary font-medium mt-1">Selected ✓</p>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                          
                          {!hasAvailable && (
                            <div className="text-center py-4 mt-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                              <AlertCircle className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                              <p className="text-foreground font-semibold text-sm">All Slots Taken</p>
                              <p className="text-xs text-muted-foreground">Please select another date.</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Buttons */}
        <div className="fixed bottom-20 md:bottom-0 left-0 right-0 p-4 glass md:relative md:mt-8 md:p-0 md:bg-transparent z-40">
          <div className="flex gap-3 max-w-lg mx-auto">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack} className="flex-1 h-14 rounded-2xl">
                <ChevronLeft className="mr-2 h-5 w-5" /> Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className={`h-14 rounded-2xl btn-premium ${currentStep === 0 ? 'w-full' : 'flex-1'}`}
            >
              {isSubmitting ? (
                <motion.div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Confirm Booking' : 'Continue'}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
