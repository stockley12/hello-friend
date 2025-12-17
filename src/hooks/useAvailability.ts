import { useMemo } from 'react';
import { useSalon } from '@/contexts/SalonContext';
import { TimeSlot, Service } from '@/types';

// Integration point: Replace with API call to fetch availability
export function useAvailability(date: string, staffId?: string, selectedServices?: string[]) {
  const { staff, bookings, services, settings } = useSalon();
  
  return useMemo(() => {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Get business hours for the day
    const businessHours = settings.businessHours[dayOfWeek];
    if (!businessHours) {
      return []; // Salon closed
    }
    
    // If staff selected, check their working hours
    let workingHours = businessHours;
    if (staffId) {
      const staffMember = staff.find(s => s.id === staffId);
      if (staffMember) {
        const staffHours = staffMember.workingHours[dayOfWeek];
        if (!staffHours) {
          return []; // Staff not working this day
        }
        workingHours = staffHours;
      }
    }
    
    // Calculate total duration of selected services
    const totalDuration = selectedServices?.reduce((acc, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return acc + (service?.durationMin || 0);
    }, 0) || 30; // Default 30 min slot
    
    // Get existing bookings for the date (and optionally staff)
    const dayBookings = bookings.filter(b => {
      if (b.date !== date) return false;
      if (b.status === 'cancelled') return false;
      if (staffId && b.staffId !== staffId) return false;
      return true;
    });
    
    // Generate time slots
    const slots: TimeSlot[] = [];
    const startHour = parseInt(workingHours.start.split(':')[0]);
    const startMin = parseInt(workingHours.start.split(':')[1]);
    const endHour = parseInt(workingHours.end.split(':')[0]);
    const endMin = parseInt(workingHours.end.split(':')[1]);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    for (let mins = startMinutes; mins <= endMinutes - totalDuration; mins += 30) {
      const hour = Math.floor(mins / 60);
      const min = mins % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      // Check if slot conflicts with existing bookings
      const slotEndMins = mins + totalDuration;
      const isAvailable = !dayBookings.some(booking => {
        const bookingStartMins = parseInt(booking.startTime.split(':')[0]) * 60 + parseInt(booking.startTime.split(':')[1]);
        const bookingEndMins = parseInt(booking.endTime.split(':')[0]) * 60 + parseInt(booking.endTime.split(':')[1]);
        
        // Check for overlap
        return mins < bookingEndMins && slotEndMins > bookingStartMins;
      });
      
      // Don't show past slots for today
      const now = new Date();
      const slotDate = new Date(date);
      slotDate.setHours(hour, min, 0, 0);
      
      const isPast = date === now.toISOString().split('T')[0] && slotDate < now;
      
      slots.push({
        time: timeStr,
        available: isAvailable && !isPast,
      });
    }
    
    return slots;
  }, [date, staffId, selectedServices, staff, bookings, services, settings]);
}

export function useStaffAvailableForServices(serviceIds: string[]) {
  const { staff } = useSalon();
  
  return useMemo(() => {
    if (!serviceIds.length) return staff;
    
    return staff.filter(s => 
      serviceIds.every(serviceId => s.servicesOffered.includes(serviceId))
    );
  }, [serviceIds, staff]);
}
