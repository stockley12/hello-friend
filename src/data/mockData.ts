import { Service, Staff, Client, Booking, SalonSettings } from '@/types';

// Services for Men & Women Hairstyling
export const mockServices: Service[] = [
  {
    id: 'srv-1',
    name: 'Box Braids',
    category: 'braids',
    durationMin: 180,
    price: 2500,
    description: 'Classic box braids in various sizes - small, medium, or large. Perfect for any occasion.',
    active: true,
  },
  {
    id: 'srv-2',
    name: 'Knotless Braids',
    category: 'braids',
    durationMin: 240,
    price: 3500,
    description: 'Lightweight, tension-free braids that start flat at the root for a natural look.',
    active: true,
  },
  {
    id: 'srv-3',
    name: 'Cornrows',
    category: 'braids',
    durationMin: 120,
    price: 1500,
    description: 'Traditional African cornrow styles for men and women. Custom patterns available.',
    active: true,
  },
  {
    id: 'srv-4',
    name: 'Fulani Braids',
    category: 'braids',
    durationMin: 180,
    price: 2800,
    description: 'Beautiful tribal-inspired style with beads and accessories.',
    active: true,
  },
  {
    id: 'srv-5',
    name: 'Twist Styles',
    category: 'twists',
    durationMin: 150,
    price: 2000,
    description: 'Senegalese twists, passion twists, or marley twists - your choice!',
    active: true,
  },
  {
    id: 'srv-6',
    name: 'Locs Maintenance',
    category: 'locs',
    durationMin: 90,
    price: 1200,
    description: 'Retwisting, interlocking, and styling for mature locs.',
    active: true,
  },
  {
    id: 'srv-7',
    name: 'Mens Cut & Style',
    category: 'mens',
    durationMin: 45,
    price: 800,
    description: 'Fresh cuts, fades, and lineups for the modern gentleman.',
    active: true,
  },
  {
    id: 'srv-8',
    name: 'Natural Hair Styling',
    category: 'natural',
    durationMin: 60,
    price: 1000,
    description: 'Wash, condition, and style for natural curls and coils.',
    active: true,
  },
];

// Staff
export const mockStaff: Staff[] = [
  {
    id: 'staff-1',
    name: 'Amara',
    title: 'Master Braider',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    bio: 'Specialist in knotless braids and protective styles with 8+ years experience.',
    workingHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '10:00', end: '19:00' },
      friday: { start: '10:00', end: '19:00' },
      saturday: { start: '09:00', end: '17:00' },
      sunday: null,
    },
    servicesOffered: ['srv-1', 'srv-2', 'srv-3', 'srv-4', 'srv-5'],
  },
  {
    id: 'staff-2',
    name: 'Kwame',
    title: 'Mens Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Expert in fades, cornrows, and mens grooming.',
    workingHours: {
      monday: null,
      tuesday: { start: '10:00', end: '19:00' },
      wednesday: { start: '10:00', end: '19:00' },
      thursday: { start: '10:00', end: '19:00' },
      friday: { start: '10:00', end: '19:00' },
      saturday: { start: '09:00', end: '17:00' },
      sunday: null,
    },
    servicesOffered: ['srv-3', 'srv-6', 'srv-7'],
  },
  {
    id: 'staff-3',
    name: 'Fatima',
    title: 'Loc Technician',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    bio: 'Certified loctician specializing in starter locs and maintenance.',
    workingHours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: null,
      thursday: { start: '10:00', end: '19:00' },
      friday: { start: '10:00', end: '19:00' },
      saturday: { start: '09:00', end: '16:00' },
      sunday: null,
    },
    servicesOffered: ['srv-5', 'srv-6', 'srv-8'],
  },
];

// Clients
export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Sarah Johnson',
    phone: '+90 532 123 4567',
    email: 'sarah.j@email.com',
    notes: 'Prefers knotless braids. Sensitive edges.',
    tags: ['VIP', 'Regular'],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'client-2',
    name: 'Marcus Williams',
    phone: '+90 533 234 5678',
    email: 'marcus.w@email.com',
    notes: 'Regular customer for fades.',
    tags: ['Regular'],
    createdAt: '2024-02-20T14:30:00Z',
  },
];

// Bookings
export const mockBookings: Booking[] = [
  {
    id: 'book-1',
    clientId: 'client-1',
    staffId: 'staff-1',
    services: ['srv-2'],
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '14:00',
    status: 'confirmed',
    notes: 'Medium knotless braids',
    createdAt: '2024-06-10T08:00:00Z',
  },
];

export const defaultSalonSettings: SalonSettings = {
  name: "La'Couronne",
  address: 'Nişantaşı, İstanbul',
  phone: '+90 212 555 0100',
  email: 'info@lacouronne.com',
  whatsappNumber: '905325550100',
  instagramHandle: 'lcouronne',
  businessHours: {
    monday: { start: '09:00', end: '18:00' },
    tuesday: { start: '09:00', end: '18:00' },
    wednesday: { start: '09:00', end: '18:00' },
    thursday: { start: '10:00', end: '19:00' },
    friday: { start: '10:00', end: '19:00' },
    saturday: { start: '09:00', end: '17:00' },
    sunday: null,
  },
  whatsappTemplate: `Hello! I'd like to confirm my appointment:\n\nName: {clientName}\nService: {serviceName}\nDate: {date}\nTime: {time}\nBooking ID: {id}\n\nPlease confirm. Thank you!`,
  adminPin: '1234',
};
