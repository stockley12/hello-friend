// DATA MODELS
// Integration point: These types will match your backend API schema

export type ServiceCategory = 'cut' | 'color' | 'treatment' | 'styling' | 'extensions' | 'braids' | 'twists' | 'locs' | 'mens' | 'natural';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
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
}

export interface BookingFormData {
  services: string[];
  staffId?: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes?: string;
}
