import { supabase, isSupabaseConfigured } from './supabase';
import type { Service, Client, Booking, Staff, SalonSettings, GalleryImage, AvailabilitySettings } from '../types';

// ============================================
// SERVICES
// ============================================

export async function fetchServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) return [];
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  
  return data.map(row => ({
    id: row.id,
    name: row.name,
    category: row.category,
    gender: row.gender || 'all',
    durationMin: row.duration_min,
    price: parseFloat(row.price),
    description: row.description,
    active: row.active,
  }));
}

export async function createService(service: Omit<Service, 'id'>): Promise<Service | null> {
  if (!isSupabaseConfigured()) return null;
  
  const { data, error } = await supabase
    .from('services')
    .insert({
      name: service.name,
      category: service.category,
      gender: service.gender || 'all',
      duration_min: service.durationMin,
      price: service.price,
      description: service.description,
      active: service.active ?? true,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating service:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    category: data.category,
    gender: data.gender,
    durationMin: data.duration_min,
    price: parseFloat(data.price),
    description: data.description,
    active: data.active,
  };
}

export async function updateService(id: string, service: Partial<Service>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const updateData: Record<string, unknown> = {};
  if (service.name !== undefined) updateData.name = service.name;
  if (service.category !== undefined) updateData.category = service.category;
  if (service.gender !== undefined) updateData.gender = service.gender;
  if (service.durationMin !== undefined) updateData.duration_min = service.durationMin;
  if (service.price !== undefined) updateData.price = service.price;
  if (service.description !== undefined) updateData.description = service.description;
  if (service.active !== undefined) updateData.active = service.active;
  
  const { error } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating service:', error);
    return false;
  }
  
  return true;
}

export async function deleteService(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting service:', error);
    return false;
  }
  
  return true;
}

// ============================================
// CLIENTS
// ============================================

export async function fetchClients(): Promise<Client[]> {
  if (!isSupabaseConfigured()) return [];
  
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  
  return data.map(row => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || '',
    notes: row.notes || '',
    tags: row.tags || [],
    createdAt: row.created_at,
  }));
}

export async function createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client | null> {
  if (!isSupabaseConfigured()) return null;
  
  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: client.name,
      phone: client.phone,
      email: client.email || '',
      notes: client.notes || '',
      tags: client.tags || [],
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating client:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    email: data.email || '',
    notes: data.notes || '',
    tags: data.tags || [],
    createdAt: data.created_at,
  };
}

export async function updateClient(id: string, client: Partial<Client>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { error } = await supabase
    .from('clients')
    .update({
      name: client.name,
      phone: client.phone,
      email: client.email,
      notes: client.notes,
      tags: client.tags,
    })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating client:', error);
    return false;
  }
  
  return true;
}

export async function deleteClient(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting client:', error);
    return false;
  }
  
  return true;
}

// ============================================
// BOOKINGS
// ============================================

export async function fetchBookings(): Promise<Booking[]> {
  if (!isSupabaseConfigured()) return [];
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  
  return data.map(row => ({
    id: row.id,
    clientId: row.client_id,
    staffId: row.staff_id,
    services: row.services || [],
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    status: row.status,
    notes: row.notes || '',
    createdAt: row.created_at,
  }));
}

export async function createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking | null> {
  if (!isSupabaseConfigured()) return null;
  
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      client_id: booking.clientId,
      staff_id: booking.staffId || null,
      services: booking.services || [],
      date: booking.date,
      start_time: booking.startTime,
      end_time: booking.endTime,
      status: booking.status || 'pending',
      notes: booking.notes || '',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }
  
  return {
    id: data.id,
    clientId: data.client_id,
    staffId: data.staff_id,
    services: data.services || [],
    date: data.date,
    startTime: data.start_time,
    endTime: data.end_time,
    status: data.status,
    notes: data.notes || '',
    createdAt: data.created_at,
  };
}

export async function updateBooking(id: string, booking: Partial<Booking>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const updateData: Record<string, unknown> = {};
  if (booking.clientId !== undefined) updateData.client_id = booking.clientId;
  if (booking.staffId !== undefined) updateData.staff_id = booking.staffId;
  if (booking.services !== undefined) updateData.services = booking.services;
  if (booking.date !== undefined) updateData.date = booking.date;
  if (booking.startTime !== undefined) updateData.start_time = booking.startTime;
  if (booking.endTime !== undefined) updateData.end_time = booking.endTime;
  if (booking.status !== undefined) updateData.status = booking.status;
  if (booking.notes !== undefined) updateData.notes = booking.notes;
  
  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', id);
  
  if (error) {
    console.error('Error updating booking:', error);
    return false;
  }
  
  return true;
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
  
  return true;
}

export async function deleteBooking(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting booking:', error);
    return false;
  }
  
  return true;
}

// ============================================
// STAFF
// ============================================

export async function fetchStaff(): Promise<Staff[]> {
  if (!isSupabaseConfigured()) return [];
  
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
  
  return data.map(row => ({
    id: row.id,
    name: row.name,
    title: row.title || '',
    avatar: row.avatar || '',
    bio: row.bio || '',
    workingHours: row.working_hours || {},
    servicesOffered: row.services_offered || [],
  }));
}

export async function createStaff(staff: Omit<Staff, 'id'>): Promise<Staff | null> {
  if (!isSupabaseConfigured()) return null;
  
  const { data, error } = await supabase
    .from('staff')
    .insert({
      name: staff.name,
      title: staff.title,
      avatar: staff.avatar,
      bio: staff.bio,
      working_hours: staff.workingHours,
      services_offered: staff.servicesOffered,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating staff:', error);
    return null;
  }
  
  return {
    id: data.id,
    name: data.name,
    title: data.title || '',
    avatar: data.avatar || '',
    bio: data.bio || '',
    workingHours: data.working_hours || {},
    servicesOffered: data.services_offered || [],
  };
}

export async function updateStaff(id: string, staff: Partial<Staff>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { error } = await supabase
    .from('staff')
    .update({
      name: staff.name,
      title: staff.title,
      avatar: staff.avatar,
      bio: staff.bio,
      working_hours: staff.workingHours,
      services_offered: staff.servicesOffered,
    })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating staff:', error);
    return false;
  }
  
  return true;
}

export async function deleteStaff(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting staff:', error);
    return false;
  }
  
  return true;
}

// ============================================
// SETTINGS
// ============================================

export async function fetchSettings(): Promise<SalonSettings | null> {
  if (!isSupabaseConfigured()) return null;
  
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
  
  return {
    name: data.name,
    address: data.address || '',
    phone: data.phone || '',
    email: data.email || '',
    whatsappNumber: data.whatsapp_number || '',
    instagramHandle: data.instagram_handle || '',
    businessHours: data.business_hours || {},
    whatsappTemplate: data.whatsapp_template || '',
    adminPin: data.admin_pin || '67771',
  };
}

export async function updateSettings(settings: Partial<SalonSettings>): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { error } = await supabase
    .from('settings')
    .update({
      name: settings.name,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      whatsapp_number: settings.whatsappNumber,
      instagram_handle: settings.instagramHandle,
      business_hours: settings.businessHours,
      whatsapp_template: settings.whatsappTemplate,
      admin_pin: settings.adminPin,
    })
    .eq('id', 1);
  
  if (error) {
    console.error('Error updating settings:', error);
    return false;
  }
  
  return true;
}

// ============================================
// GALLERY
// ============================================

export async function fetchGallery(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) return [];
  
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
  
  return data.map(row => ({
    id: row.id,
    url: row.url,
    category: row.category,
    mediaType: row.media_type || 'image',
    caption: row.caption || '',
    createdAt: row.created_at,
  }));
}

export async function addGalleryImage(image: Omit<GalleryImage, 'id' | 'createdAt'>): Promise<GalleryImage | null> {
  if (!isSupabaseConfigured()) return null;
  
  const { data, error } = await supabase
    .from('gallery')
    .insert({
      url: image.url,
      category: image.category,
      media_type: image.mediaType || 'image',
      caption: image.caption || '',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding gallery image:', error);
    return null;
  }
  
  return {
    id: data.id,
    url: data.url,
    category: data.category,
    mediaType: data.media_type || 'image',
    caption: data.caption || '',
    createdAt: data.created_at,
  };
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting gallery image:', error);
    return false;
  }
  
  return true;
}

// Upload file to gallery storage bucket
export async function uploadGalleryFile(file: File, category: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${category}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('gallery')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('gallery')
    .getPublicUrl(data.path);
  
  return urlData.publicUrl;
}

// Delete file from gallery storage bucket
export async function deleteGalleryFile(url: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  // Extract file path from URL
  const urlParts = url.split('/gallery/');
  if (urlParts.length < 2) return false;
  
  const filePath = urlParts[1];
  
  const { error } = await supabase.storage
    .from('gallery')
    .remove([filePath]);
  
  if (error) {
    console.error('Error deleting file:', error);
    return false;
  }
  
  return true;
}

// ============================================
// AVAILABILITY
// ============================================

// Define a simpler type for the availability response from Supabase
interface SupabaseAvailabilityData {
  time_slots: string[];
  blocked_dates: Array<{ id: string; date: string; reason: string }>;
}

export async function fetchAvailability(): Promise<SupabaseAvailabilityData | null> {
  if (!isSupabaseConfigured()) return null;
  
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (error) {
    console.error('Error fetching availability:', error);
    return null;
  }
  
  return {
    time_slots: (data.time_slots as string[]) || [],
    blocked_dates: (data.blocked_dates as Array<{ id: string; date: string; reason: string }>) || [],
  };
}

export async function updateAvailability(settings: { time_slots: string[]; blocked_dates: Array<{ id: string; date: string; reason: string }> }): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { error } = await supabase
    .from('availability')
    .upsert({
      id: 1,
      time_slots: settings.time_slots,
      blocked_dates: settings.blocked_dates,
    });
  
  if (error) {
    console.error('Error updating availability:', error);
    return false;
  }
  
  return true;
}

// ============================================
// REALTIME SUBSCRIPTIONS
// ============================================

export function subscribeToBookings(callback: (bookings: Booking[]) => void) {
  if (!isSupabaseConfigured()) return () => {};
  
  const subscription = supabase
    .channel('bookings-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings' },
      async () => {
        // Refetch all bookings when any change occurs
        const bookings = await fetchBookings();
        callback(bookings);
      }
    )
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}

export function subscribeToClients(callback: (clients: Client[]) => void) {
  if (!isSupabaseConfigured()) return () => {};
  
  const subscription = supabase
    .channel('clients-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'clients' },
      async () => {
        const clients = await fetchClients();
        callback(clients);
      }
    )
    .subscribe();
  
  return () => {
    subscription.unsubscribe();
  };
}

// ============================================
// AUTH
// ============================================

export async function verifyAdminPin(pin: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  
  const { data, error } = await supabase
    .from('settings')
    .select('admin_pin')
    .eq('id', 1)
    .single();
  
  if (error) {
    console.error('Error verifying PIN:', error);
    return false;
  }
  
  return data.admin_pin === pin;
}

