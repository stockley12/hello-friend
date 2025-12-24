// DATA MODELS
// Integration point: These types will match your backend API schema

export type ServiceCategory = 'cut' | 'color' | 'treatment' | 'styling' | 'extensions' | 'braids' | 'twists' | 'locs' | 'mens' | 'natural';

export type ServiceGender = 'female' | 'male' | 'both';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  gender: ServiceGender; // Who this service is for
  durationMin: number;
  price: number;
  description: string;
  active: boolean;
}

export interface WorkingHours {
  [key: string]: { start: string; end: string } | null; // null = day off
}

export interface Staff {
  id: string;
  name: string;
  title: string;
  avatar: string;
  workingHours: WorkingHours;
  servicesOffered: string[]; // service IDs
  bio?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  tags: string[];
  createdAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';

export interface Booking {
  id: string;
  clientId: string;
  staffId?: string;
  services: string[]; // service IDs
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  notes: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
}

export interface SalonSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  instagramHandle: string;
  businessHours: WorkingHours;
  whatsappTemplate: string;
  adminPin: string;
  termsAndConditions?: string;
  cancellationPolicy?: string;
}

export type ClientGender = 'female' | 'male';

export interface BookingFormData {
  gender: ClientGender;
  services: string[];
  staffId?: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
}

// Availability Management
export interface DaySchedule {
  isOpen: boolean;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
}

export interface WeeklySchedule {
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
}

export interface BlockedDate {
  id: string;
  date: string;      // YYYY-MM-DD
  reason: string;    // e.g., "Holiday", "Day Off", "Vacation"
}

export interface AvailabilitySettings {
  weeklySchedule: WeeklySchedule;
  blockedDates: BlockedDate[];
  slotDurationMinutes: number;  // Duration of each appointment slot (e.g., 240 = 4 hours)
  maxBookingsPerSlot: number;   // How many bookings per time slot
}

// Income Tracking
export interface IncomeEntry {
  id: string;
  date: string;          // YYYY-MM-DD
  amount: number;        // Amount in Turkish Lira (₺)
  note?: string;         // Optional note (e.g., "Cash", "Card", etc.)
  createdAt: string;
}

// Client loyalty status
export type ClientLoyaltyStatus = 'new' | 'regular' | 'vip';

// Dashboard Statistics
export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalClients: number;
  newClientsThisMonth: number;
  vipClients: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
}

// Gallery
export type GalleryCategory = 'women' | 'men';
export type MediaType = 'image' | 'video';

export interface GalleryImage {
  id: string;
  url: string;
  category: GalleryCategory;
  mediaType: MediaType;
  caption?: string;
  createdAt: string;
}
