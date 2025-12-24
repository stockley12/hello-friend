import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get these from your Supabase project dashboard:
// Settings → API → Project URL and anon/public key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Only create client if credentials exist, otherwise create a dummy that won't be used
let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase connected');
} else {
  console.warn('⚠️ Supabase credentials not configured. Using localStorage fallback.');
}

// Export a safe getter - returns null if not configured
export const supabase = supabaseInstance as SupabaseClient;

// Database types
export interface DbService {
  id: string;
  name: string;
  category: string;
  gender: 'female' | 'male' | 'both';
  duration_min: number;
  price: number;
  description: string;
  active: boolean;
  created_at?: string;
}

export interface DbClient {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  tags?: string[];
  created_at?: string;
}

export interface DbBooking {
  id: string;
  client_id: string;
  staff_id?: string;
  services: string[];
  date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  created_at?: string;
}

export interface DbStaff {
  id: string;
  name: string;
  title?: string;
  avatar?: string;
  bio?: string;
  working_hours?: Record<string, { start: string; end: string } | null>;
  services_offered?: string[];
  created_at?: string;
}

export interface DbSettings {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp_number?: string;
  instagram_handle?: string;
  business_hours?: Record<string, { start: string; end: string } | null>;
  whatsapp_template?: string;
  admin_pin: string;
}

export interface DbGalleryImage {
  id: string;
  url: string;
  category: 'women' | 'men';
  caption?: string;
  created_at?: string;
}

