import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Save, 
  Plus, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Ban,
  Users,
  Timer
} from 'lucide-react';
import { useSalon } from '@/contexts/SalonContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { haptics } from '@/lib/haptics';
import { AvailabilitySettings } from '@/types';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
] as const;

const DURATION_OPTIONS = [
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
  { value: 300, label: '5 hours' },
  { value: 360, label: '6 hours' },
];

const MAX_BOOKINGS_OPTIONS = [1, 2, 3, 4, 5];

export function AdminAvailability() {
  const { availability, updateAvailability } = useSalon();
  const [localSchedule, setLocalSchedule] = useState(availability.weeklySchedule);
  const [blockedDates, setBlockedDates] = useState(availability.blockedDates);
  const [slotDuration, setSlotDuration] = useState(availability.slotDurationMinutes);
  const [maxBookings, setMaxBookings] = useState(availability.maxBookingsPerSlot);
  const [newBlockedDate, setNewBlockedDate] = useState<Date | undefined>(undefined);
  const [newBlockedReason, setNewBlockedReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDayToggle = (day: keyof typeof localSchedule) => {
    haptics.selection();
    setLocalSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen
      }
    }));
  };

  const handleTimeChange = (
    day: keyof typeof localSchedule, 
    field: 'startTime' | 'endTime', 
    value: string
  ) => {
    setLocalSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    
    haptics.medium();
    const dateStr = format(newBlockedDate, 'yyyy-MM-dd');
    
    if (blockedDates.some(d => d.date === dateStr)) return;
    
    setBlockedDates(prev => [...prev, {
      id: `block-${Date.now()}`,
      date: dateStr,
      reason: newBlockedReason || 'Day Off'
    }]);
    setNewBlockedDate(undefined);
    setNewBlockedReason('');
  };

  const handleRemoveBlockedDate = (id: string) => {
    haptics.light();
    setBlockedDates(prev => prev.filter(d => d.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    haptics.medium();
    
    try {
      const newAvailability: AvailabilitySettings = {
        weeklySchedule: localSchedule,
        blockedDates,
        slotDurationMinutes: slotDuration,
        maxBookingsPerSlot: maxBookings
      };
      
      await updateAvailability(newAvailability);
      
      setShowSuccess(true);
      haptics.success();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save availability:', error);
      haptics.error();
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate time slots for preview
  const getTimeSlotsPreview = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];
    const [startHour] = startTime.split(':').map(Number);
    const [endHour] = endTime.split(':').map(Number);
    const durationHours = slotDuration / 60;
    
    for (let hour = startHour; hour + durationHours <= endHour; hour += durationHours) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    return slots;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Availability Settings</h1>
          <p className="text-muted-foreground mt-1">
            Control your working hours and booking availability
          </p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold"
        >
          {isSaving ? (
            <motion.div
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-600 text-white rounded-xl p-4 flex items-center gap-3 shadow-lg"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span className="font-semibold">
            ✅ Settings saved! Changes will apply to new bookings immediately.
          </span>
        </motion.div>
      )}

      {/* Appointment Settings */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Timer className="w-5 h-5 text-primary" />
            Appointment Settings
          </CardTitle>
          <CardDescription>
            Configure appointment duration and capacity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Slot Duration */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Appointment Duration
              </Label>
              <Select 
                value={slotDuration.toString()} 
                onValueChange={(v) => setSlotDuration(parseInt(v))}
              >
                <SelectTrigger className="h-12 text-base bg-background border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How long each appointment lasts
              </p>
            </div>

            {/* Max Bookings */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Max Bookings Per Slot
              </Label>
              <Select 
                value={maxBookings.toString()} 
                onValueChange={(v) => setMaxBookings(parseInt(v))}
              >
                <SelectTrigger className="h-12 text-base bg-background border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MAX_BOOKINGS_OPTIONS.map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'client' : 'clients'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How many clients can book the same time slot
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card className="border-2">
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Set your working hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {DAYS_OF_WEEK.map(({ key, label }, index) => {
            const daySchedule = localSchedule[key];
            const slots = daySchedule.isOpen 
              ? getTimeSlotsPreview(daySchedule.startTime, daySchedule.endTime) 
              : [];
            
            return (
              <motion.div
                key={key}
                className={`p-4 border-b border-border last:border-b-0 transition-all ${
                  daySchedule.isOpen 
                    ? 'bg-primary/5' 
                    : 'bg-muted/50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Day Name & Toggle */}
                  <div className="flex items-center gap-4 min-w-[140px]">
                    <Switch
                      checked={daySchedule.isOpen}
                      onCheckedChange={() => handleDayToggle(key)}
                    />
                    <div>
                      <span className="font-bold text-foreground">{label}</span>
                      <span className={`ml-2 text-sm font-medium px-2 py-0.5 rounded ${
                        daySchedule.isOpen 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {daySchedule.isOpen ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Time Inputs */}
                  {daySchedule.isOpen && (
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                          From:
                        </Label>
                        <Input
                          type="time"
                          value={daySchedule.startTime}
                          onChange={(e) => handleTimeChange(key, 'startTime', e.target.value)}
                          className="w-28 h-10 text-center font-mono text-base border-2 border-primary/30"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                          To:
                        </Label>
                        <Input
                          type="time"
                          value={daySchedule.endTime}
                          onChange={(e) => handleTimeChange(key, 'endTime', e.target.value)}
                          className="w-28 h-10 text-center font-mono text-base border-2 border-primary/30"
                        />
                      </div>
                      
                      {/* Slots Preview */}
                      {slots.length > 0 && (
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-sm text-muted-foreground">Slots:</span>
                          <div className="flex flex-wrap gap-1">
                            {slots.map(slot => (
                              <span 
                                key={slot} 
                                className="px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded"
                              >
                                {slot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!daySchedule.isOpen && (
                    <span className="text-muted-foreground font-medium">
                      No appointments on this day
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Blocked Dates */}
      <Card className="border-2 border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="flex items-center gap-2 text-lg text-red-700">
            <Ban className="w-5 h-5" />
            Blocked Dates (Days Off)
          </CardTitle>
          <CardDescription className="text-red-600">
            Block specific dates when you're not available (holidays, vacations, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add new blocked date */}
            <div className="space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-600" />
                Block a Date
              </h3>
              
              <div className="bg-white rounded-xl p-4 border-2 border-dashed border-red-300">
                <CalendarPicker
                  mode="single"
                  selected={newBlockedDate}
                  onSelect={setNewBlockedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  className="rounded-lg mx-auto"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="font-semibold">Reason</Label>
                <Input
                  placeholder="e.g., Holiday, Vacation, Personal Day"
                  value={newBlockedReason}
                  onChange={(e) => setNewBlockedReason(e.target.value)}
                  className="h-12 text-base border-2"
                />
              </div>
              
              <Button 
                onClick={handleAddBlockedDate}
                disabled={!newBlockedDate}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-base"
              >
                <Ban className="w-5 h-5 mr-2" />
                Block This Date
              </Button>
            </div>
            
            {/* List of blocked dates */}
            <div className="space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                Blocked Dates ({blockedDates.length})
              </h3>
              
              {blockedDates.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-xl border-2 border-dashed">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground font-medium">No dates blocked</p>
                  <p className="text-sm text-muted-foreground">
                    Select a date from the calendar to block bookings
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {blockedDates
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map(blocked => (
                      <motion.div
                        key={blocked.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-red-100 border-2 border-red-300"
                      >
                        <div>
                          <p className="font-bold text-red-800 text-lg">
                            {format(parseISO(blocked.date), 'EEE, MMM d, yyyy')}
                          </p>
                          <p className="text-sm text-red-600 font-medium">
                            📌 {blocked.reason}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBlockedDate(blocked.id)}
                          className="h-10 w-10 text-red-600 hover:text-white hover:bg-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <Card className="bg-blue-600 text-white border-0">
        <CardContent className="py-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">How This Works</h3>
              <ul className="space-y-1 text-blue-100">
                <li>✅ <strong>Weekly Schedule:</strong> Sets your regular working hours</li>
                <li>✅ <strong>Blocked Dates:</strong> Override for specific days off</li>
                <li>✅ <strong>Time Slots:</strong> Auto-generated based on duration setting</li>
                <li>✅ <strong>Booking Page:</strong> Updates instantly for customers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
