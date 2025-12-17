import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, Staff, Client, Booking, SalonSettings, BookingStatus } from '@/types';
import { mockServices, mockStaff, mockClients, mockBookings, defaultSalonSettings } from '@/data/mockData';

interface SalonContextType {
  // Data
  services: Service[];
  staff: Staff[];
  clients: Client[];
  bookings: Booking[];
  settings: SalonSettings;
  
  // Service actions
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  // Staff actions
  addStaff: (staffMember: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staffMember: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  
  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  // Booking actions
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBooking: (id: string) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<SalonSettings>) => void;
  
  // Auth
  isAdminAuthenticated: boolean;
  authenticateAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  
  // Utility
  getServiceById: (id: string) => Service | undefined;
  getStaffById: (id: string) => Staff | undefined;
  getClientById: (id: string) => Client | undefined;
  getBookingById: (id: string) => Booking | undefined;
  generateWhatsAppLink: (booking: Booking) => string;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const STORAGE_KEYS = {
  services: 'luxe_services',
  staff: 'luxe_staff',
  clients: 'luxe_clients',
  bookings: 'luxe_bookings',
  settings: 'luxe_settings',
  adminAuth: 'luxe_admin_auth',
};

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function SalonProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.services);
    return stored ? JSON.parse(stored) : mockServices;
  });
  
  const [staff, setStaff] = useState<Staff[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.staff);
    return stored ? JSON.parse(stored) : mockStaff;
  });
  
  const [clients, setClients] = useState<Client[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.clients);
    return stored ? JSON.parse(stored) : mockClients;
  });
  
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.bookings);
    return stored ? JSON.parse(stored) : mockBookings;
  });
  
  const [settings, setSettings] = useState<SalonSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.settings);
    return stored ? JSON.parse(stored) : defaultSalonSettings;
  });
  
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.adminAuth) === 'true';
  });
  
  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(services));
  }, [services]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(staff));
  }, [staff]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
  }, [clients]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
  }, [bookings]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings]);
  
  // Service actions
  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: generateId('srv') };
    setServices(prev => [...prev, newService]);
  };
  
  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };
  
  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };
  
  // Staff actions
  const addStaff = (staffMember: Omit<Staff, 'id'>) => {
    const newStaff = { ...staffMember, id: generateId('staff') };
    setStaff(prev => [...prev, newStaff]);
  };
  
  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };
  
  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };
  
  // Client actions
  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient = { ...client, id: generateId('client'), createdAt: new Date().toISOString() };
    setClients(prev => [...prev, newClient]);
    return newClient;
  };
  
  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  
  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };
  
  // Booking actions
  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking = { ...booking, id: generateId('book'), createdAt: new Date().toISOString() };
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };
  
  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };
  
  const updateBookingStatus = (id: string, status: BookingStatus) => {
    updateBooking(id, { status });
  };
  
  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };
  
  // Settings actions
  const updateSettings = (updates: Partial<SalonSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };
  
  // Auth
  const authenticateAdmin = (pin: string): boolean => {
    if (pin === settings.adminPin) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.adminAuth, 'true');
      return true;
    }
    return false;
  };
  
  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.adminAuth);
  };
  
  // Utility
  const getServiceById = (id: string) => services.find(s => s.id === id);
  const getStaffById = (id: string) => staff.find(s => s.id === id);
  const getClientById = (id: string) => clients.find(c => c.id === id);
  const getBookingById = (id: string) => bookings.find(b => b.id === id);
  
  const generateWhatsAppLink = (booking: Booking): string => {
    const client = getClientById(booking.clientId);
    const serviceNames = booking.services
      .map(id => getServiceById(id)?.name)
      .filter(Boolean)
      .join(', ');
    
    let message = settings.whatsappTemplate
      .replace('{clientName}', client?.name || 'Guest')
      .replace('{serviceName}', serviceNames)
      .replace('{date}', booking.date)
      .replace('{time}', booking.startTime)
      .replace('{id}', booking.id);
    
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };
  
  const value: SalonContextType = {
    services,
    staff,
    clients,
    bookings,
    settings,
    addService,
    updateService,
    deleteService,
    addStaff,
    updateStaff,
    deleteStaff,
    addClient,
    updateClient,
    deleteClient,
    addBooking,
    updateBooking,
    updateBookingStatus,
    deleteBooking,
    updateSettings,
    isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin,
    getServiceById,
    getStaffById,
    getClientById,
    getBookingById,
    generateWhatsAppLink,
  };
  
  return (
    <SalonContext.Provider value={value}>
      {children}
    </SalonContext.Provider>
  );
}

export function useSalon() {
  const context = useContext(SalonContext);
  if (context === undefined) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
}
