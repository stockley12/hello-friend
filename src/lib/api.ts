// API Configuration
// Only use API if explicitly set, otherwise use offline mode
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// If no API URL, don't try to connect
const API_ENABLED = Boolean(API_BASE_URL);

// Fast timeout for API calls (2 seconds) - fails quickly to use offline mode
const API_TIMEOUT = 2000;

// Generic fetch wrapper with error handling and fast timeout
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // If no API URL configured, throw immediately to use offline mode
  if (!API_ENABLED) {
    throw new Error('API not configured - using offline mode');
  }
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API timeout - using offline mode');
    }
    throw error;
  }
}

// ============================================
// SERVICES API
// ============================================

import type { Service } from '@/types';

export const servicesAPI = {
  getAll: () => fetchAPI<Service[]>('/services'),
  
  create: (service: Omit<Service, 'id'>) => 
    fetchAPI<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    }),
  
  update: (id: string, service: Partial<Service>) =>
    fetchAPI<{ success: boolean }>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    }),
  
  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/services/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================
// STAFF API
// ============================================

import type { Staff } from '@/types';

export const staffAPI = {
  getAll: () => fetchAPI<Staff[]>('/staff'),
  
  create: (staff: Omit<Staff, 'id'>) =>
    fetchAPI<Staff>('/staff', {
      method: 'POST',
      body: JSON.stringify(staff),
    }),
  
  update: (id: string, staff: Partial<Staff>) =>
    fetchAPI<{ success: boolean }>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staff),
    }),
  
  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/staff/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================
// CLIENTS API
// ============================================

import type { Client } from '@/types';

export const clientsAPI = {
  getAll: () => fetchAPI<Client[]>('/clients'),
  
  create: (client: Omit<Client, 'id' | 'createdAt'>) =>
    fetchAPI<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    }),
  
  update: (id: string, client: Partial<Client>) =>
    fetchAPI<{ success: boolean }>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    }),
  
  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/clients/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================
// BOOKINGS API
// ============================================

import type { Booking, BookingStatus } from '@/types';

export const bookingsAPI = {
  getAll: () => fetchAPI<Booking[]>('/bookings'),
  
  create: (booking: Omit<Booking, 'id' | 'createdAt'>) =>
    fetchAPI<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    }),
  
  update: (id: string, booking: Partial<Booking>) =>
    fetchAPI<{ success: boolean }>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(booking),
    }),
  
  updateStatus: (id: string, status: BookingStatus) =>
    fetchAPI<{ success: boolean }>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/bookings/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================
// SETTINGS API
// ============================================

import type { SalonSettings } from '@/types';

export const settingsAPI = {
  get: () => fetchAPI<SalonSettings>('/settings'),
  
  update: (settings: Partial<SalonSettings>) =>
    fetchAPI<{ success: boolean }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  verifyPin: (pin: string) =>
    fetchAPI<{ valid: boolean }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ pin }),
    }),
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthAPI = {
  check: () => fetchAPI<{ status: string; database: string; timestamp: string }>('/health'),
};



