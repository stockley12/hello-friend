import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { Service, Staff, Client, Booking, SalonSettings, BookingStatus, AvailabilitySettings, IncomeEntry, DashboardStats, GalleryImage, GalleryCategory } from '@/types';
import { servicesAPI, staffAPI, clientsAPI, bookingsAPI, settingsAPI, authAPI } from '@/lib/api';
import { mockServices, mockStaff, mockClients, mockBookings, defaultSalonSettings, defaultAvailability } from '@/data/mockData';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isWithinInterval, format } from 'date-fns';
import { playNotificationSound } from '@/lib/notifications';
import { isSupabaseConfigured } from '@/lib/supabase';
import * as supabaseService from '@/lib/supabaseService';

interface SalonContextType {
  // Data
  services: Service[];
  staff: Staff[];
  clients: Client[];
  bookings: Booking[];
  settings: SalonSettings;
  availability: AvailabilitySettings;
  incomeEntries: IncomeEntry[];
  dashboardStats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  
  // Service actions
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  
  // Staff actions
  addStaff: (staffMember: Omit<Staff, 'id'>) => Promise<void>;
  updateStaff: (id: string, staffMember: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  
  // Client actions
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<Client>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  
  // Booking actions
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Promise<Booking>;
  updateBooking: (id: string, booking: Partial<Booking>) => Promise<void>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  
  // Settings actions
  updateSettings: (settings: Partial<SalonSettings>) => Promise<void>;
  
  // Availability actions
  updateAvailability: (availability: AvailabilitySettings) => Promise<void>;
  
  // Income actions
  addIncome: (amount: number, note?: string, date?: string) => void;
  deleteIncome: (id: string) => void;
  
  // Gallery actions
  galleryImages: GalleryImage[];
  addGalleryImage: (url: string, category: GalleryCategory, caption?: string) => void;
  deleteGalleryImage: (id: string) => void;
  
  // Booking alerts (auto-dismiss)
  bookingAlert: { clientName: string; date: string; time: string } | null;
  clearBookingAlert: () => void;
  
  // Auth
  isAdminAuthenticated: boolean;
  authenticateAdmin: (pin: string) => Promise<boolean>;
  logoutAdmin: () => void;
  
  // Utility
  getServiceById: (id: string) => Service | undefined;
  getStaffById: (id: string) => Staff | undefined;
  getClientById: (id: string) => Client | undefined;
  getBookingById: (id: string) => Booking | undefined;
  generateWhatsAppLink: (booking: Booking) => string;
  getAvailableTimeSlots: (date: Date) => string[];
  getAllTimeSlotsWithStatus: (date: Date) => Array<{ time: string; available: boolean; bookedCount: number }>;
  isDayAvailable: (date: Date) => boolean;
  toggleClientVIP: (clientId: string) => void;
  
  // Refresh data
  refreshData: () => Promise<void>;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const STORAGE_KEYS = {
  adminAuth: 'lacouronne_admin_auth',
  availability: 'lacouronne_availability',
  income: 'lacouronne_income',
  clients: 'lacouronne_clients',
  bookings: 'lacouronne_bookings',
  gallery: 'lacouronne_gallery',
  services: 'lacouronne_services',
  staff: 'lacouronne_staff',
  settings: 'lacouronne_settings',
};

// Default gallery images - empty so admin can add their own
const defaultGalleryImages: GalleryImage[] = [];

export function SalonProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.services);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockServices;
      }
    }
    return mockServices;
  });
  
  const [staff, setStaff] = useState<Staff[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.staff);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockStaff;
      }
    }
    return mockStaff;
  });
  const [clients, setClients] = useState<Client[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.clients);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockClients;
      }
    }
    return mockClients;
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.bookings);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return mockBookings;
      }
    }
    return mockBookings;
  });
  const [settings, setSettings] = useState<SalonSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.settings);
    if (stored) {
      try {
        return { ...defaultSalonSettings, ...JSON.parse(stored) };
      } catch {
        return defaultSalonSettings;
      }
    }
    return defaultSalonSettings;
  });
  const [availability, setAvailability] = useState<AvailabilitySettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.availability);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultAvailability;
      }
    }
    return defaultAvailability;
  });
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.gallery);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultGalleryImages;
      }
    }
    return defaultGalleryImages;
  });

  // Booking alert state - auto dismisses, no click needed
  const [bookingAlert, setBookingAlert] = useState<{ clientName: string; date: string; time: string } | null>(null);
  const [lastBookingCount, setLastBookingCount] = useState<number>(0);
  
  const clearBookingAlert = () => setBookingAlert(null);
  
  // Auth state - MUST be declared before useEffect that uses it
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.adminAuth) === 'true';
  });
  
  // Poll for new bookings every 5 seconds (works across tabs/devices with shared storage)
  useEffect(() => {
    // Initialize booking count on first mount
    const storedBookings = localStorage.getItem(STORAGE_KEYS.bookings);
    const initialCount = storedBookings ? JSON.parse(storedBookings).length : 0;
    setLastBookingCount(initialCount);
  }, []); // Only run once on mount

  useEffect(() => {
    const syncData = () => {
      // Sync bookings
      const storedBookings = localStorage.getItem(STORAGE_KEYS.bookings);
      if (storedBookings) {
        try {
          const parsedBookings = JSON.parse(storedBookings);
          
          // Check if there are new bookings (works even from 0)
          if (parsedBookings.length > lastBookingCount) {
            // New booking detected!
            const newBooking = parsedBookings[parsedBookings.length - 1];
            const storedClients = localStorage.getItem(STORAGE_KEYS.clients);
            const clientsList = storedClients ? JSON.parse(storedClients) : [];
            const client = clientsList.find((c: Client) => c.id === newBooking.clientId);
            
            // Sync clients state with localStorage
            if (clientsList.length !== clients.length) {
              setClients(clientsList);
            }
            
            // Only show notification in admin panel
            if (isAdminAuthenticated) {
              const formattedDate = format(parseISO(newBooking.date), 'MMM d, yyyy');
              setBookingAlert({
                clientName: client?.name || 'New Client',
                date: formattedDate,
                time: newBooking.startTime,
              });
              playNotificationSound();
            }
            
            // Update bookings state
            setBookings(parsedBookings);
            setLastBookingCount(parsedBookings.length);
          } else if (parsedBookings.length !== bookings.length) {
            // Sync bookings if count changed (e.g., deletion)
            setBookings(parsedBookings);
            setLastBookingCount(parsedBookings.length);
          }
        } catch (e) {
          console.error('Error syncing data:', e);
        }
      }
      
      // Also sync clients independently
      const storedClients = localStorage.getItem(STORAGE_KEYS.clients);
      if (storedClients) {
        try {
          const parsedClients = JSON.parse(storedClients);
          if (parsedClients.length !== clients.length) {
            setClients(parsedClients);
          }
        } catch (e) {
          console.error('Error syncing clients:', e);
        }
      }
    };
    
    // Check every 3 seconds for faster notification
    const interval = setInterval(syncData, 3000);
    
    // Also listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.bookings || e.key === STORAGE_KEYS.clients) {
        syncData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [lastBookingCount, bookings.length, clients.length, isAdminAuthenticated]);

  const [incomeEntries, setIncomeEntries] = useState<IncomeEntry[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.income);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false); // Start as false - use local data immediately
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false); // Assume offline by default for instant loading

  // Fetch all data from Supabase or API
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    // Try Supabase first if configured
    if (isSupabaseConfigured()) {
      try {
        console.log('🔌 Connecting to Supabase...');
        const [servicesData, staffData, clientsData, bookingsData, settingsData, galleryData, availabilityData] = await Promise.all([
          supabaseService.fetchServices(),
          supabaseService.fetchStaff(),
          supabaseService.fetchClients(),
          supabaseService.fetchBookings(),
          supabaseService.fetchSettings(),
          supabaseService.fetchGallery(),
          supabaseService.fetchAvailability(),
        ]);
        
        if (servicesData.length > 0) setServices(servicesData);
        if (staffData.length > 0) setStaff(staffData);
        if (clientsData.length > 0) setClients(clientsData);
        if (bookingsData.length > 0) setBookings(bookingsData);
        if (settingsData) setSettings(settingsData);
        if (galleryData.length > 0) setGalleryImages(galleryData);
        if (availabilityData) setAvailability(availabilityData);
        
        setIsOnline(true);
        console.log('✅ Supabase connected - Real-time sync enabled!');
        setIsLoading(false);
        return;
      } catch (err) {
        console.warn('Supabase connection failed, trying local API:', err);
      }
    }
    
    // Fallback to local API
    try {
      const [servicesData, staffData, clientsData, bookingsData, settingsData] = await Promise.all([
        servicesAPI.getAll(),
        staffAPI.getAll(),
        clientsAPI.getAll(),
        bookingsAPI.getAll(),
        settingsAPI.get(),
      ]);
      
      setServices(servicesData);
      setStaff(staffData);
      setClients(clientsData);
      setBookings(bookingsData);
      if (settingsData) {
        setSettings(settingsData);
      }
      setIsOnline(true);
    } catch (err) {
      console.warn('Failed to fetch from API, using local data:', err);
      setError('Using offline mode with local storage.');
      setIsOnline(false);
      // Keep using mock/cached data
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Connect to backend API on startup
  useEffect(() => {
    // Try to connect to the backend
    fetchAllData();
  }, [fetchAllData]);

  // Set up Supabase real-time subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    
    console.log('📡 Setting up real-time subscriptions...');
    
    // Subscribe to booking changes
    const unsubBookings = supabaseService.subscribeToBookings((newBookings) => {
      console.log('🔔 Bookings updated in real-time!');
      
      // Check for new bookings
      if (newBookings.length > bookings.length && isAdminAuthenticated) {
        const latestBooking = newBookings[newBookings.length - 1];
        const client = clients.find(c => c.id === latestBooking.clientId);
        
        setBookingAlert({
          clientName: client?.name || 'New Client',
          date: format(parseISO(latestBooking.date), 'MMM d, yyyy'),
          time: latestBooking.startTime,
        });
        playNotificationSound();
      }
      
      setBookings(newBookings);
      // Also update localStorage for offline access
      localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(newBookings));
    });
    
    // Subscribe to client changes
    const unsubClients = supabaseService.subscribeToClients((newClients) => {
      console.log('🔔 Clients updated in real-time!');
      setClients(newClients);
      localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(newClients));
    });
    
    return () => {
      unsubBookings();
      unsubClients();
    };
  }, [isAdminAuthenticated, bookings.length, clients]);

  // Service actions
  const addService = async (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: `srv-${Date.now()}` };
    setServices(prev => {
      const updated = [...prev, newService];
      localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(updated));
      return updated;
    });
  };
  
  const updateService = async (id: string, updates: Partial<Service>) => {
    setServices(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(updated));
      return updated;
    });
  };
  
  const deleteService = async (id: string) => {
    setServices(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.services, JSON.stringify(updated));
      return updated;
    });
  };

  // Staff actions
  const addStaff = async (staffMember: Omit<Staff, 'id'>) => {
    const newStaff = { ...staffMember, id: `staff-${Date.now()}` };
    setStaff(prev => {
      const updated = [...prev, newStaff];
      localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(updated));
      return updated;
    });
  };
  
  const updateStaff = async (id: string, updates: Partial<Staff>) => {
    setStaff(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(updated));
      return updated;
    });
  };
  
  const deleteStaff = async (id: string) => {
    setStaff(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.staff, JSON.stringify(updated));
      return updated;
    });
  };

  // Client actions
  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
    // Try Supabase first
    if (isSupabaseConfigured()) {
      const supabaseClient = await supabaseService.createClient(client);
      if (supabaseClient) {
        // Real-time subscription will update the state
        return supabaseClient;
      }
    }
    
    // Fallback to localStorage
    const newClient: Client = { 
      ...client, 
      id: `client-${Date.now()}`, 
      createdAt: new Date().toISOString() 
    };
    
    setClients(prev => {
      const updated = [...prev, newClient];
      localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(updated));
      return updated;
    });
    
    return newClient;
  };
  
  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      if (isOnline) {
        await clientsAPI.update(id, updates);
      }
      setClients(prev => {
        const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
        localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Failed to update client:', err);
      throw err;
    }
  };
  
  const deleteClient = async (id: string) => {
    try {
      if (isOnline) {
        await clientsAPI.delete(id);
      }
      setClients(prev => {
        const updated = prev.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error('Failed to delete client:', err);
      throw err;
    }
  };

  // Booking actions
  const addBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    try {
      // Try Supabase first
      if (isSupabaseConfigured()) {
        const supabaseBooking = await supabaseService.createBooking(booking);
        if (supabaseBooking) {
          console.log('✅ Booking saved to Supabase');
          // Real-time subscription will handle the update
          return supabaseBooking;
        }
      }
      
      // Fallback to localStorage
      const newBooking: Booking = { 
        ...booking, 
        id: `book-${Date.now()}`, 
        createdAt: new Date().toISOString() 
      };
      
      setBookings(prev => {
        const updated = [...prev, newBooking];
        localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(updated));
        return updated;
      });
      
      // Trigger in-app alert for new booking (auto-dismisses, no click needed)
      // Check both state AND localStorage for client (state might not be updated yet)
      let client = clients.find(c => c.id === newBooking.clientId);
      
      // If not found in state, check localStorage (client was just added)
      if (!client) {
        const storedClients = localStorage.getItem(STORAGE_KEYS.clients);
        if (storedClients) {
          const clientsList = JSON.parse(storedClients);
          client = clientsList.find((c: Client) => c.id === newBooking.clientId);
        }
      }
      
      if (client) {
        const formattedDate = format(parseISO(newBooking.date), 'MMM d, yyyy');
        setBookingAlert({
          clientName: client.name,
          date: formattedDate,
          time: newBooking.startTime,
        });
        // Play notification sound
        playNotificationSound();
      } else {
        // Fallback - still show alert with generic name
        const formattedDate = format(parseISO(newBooking.date), 'MMM d, yyyy');
        setBookingAlert({
          clientName: 'New Client',
          date: formattedDate,
          time: newBooking.startTime,
        });
        playNotificationSound();
      }
      
      return newBooking;
    } catch (err) {
      console.error('Failed to add booking:', err);
      throw err;
    }
  };
  
  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(updated));
      return updated;
    });
  };
  
  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    // Try Supabase first
    if (isSupabaseConfigured()) {
      await supabaseService.updateBookingStatus(id, status);
      // Real-time subscription will handle the update
      return;
    }
    
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status } : b);
      localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(updated));
      return updated;
    });
  };
  
  const deleteBooking = async (id: string) => {
    setBookings(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(updated));
      return updated;
    });
  };

  // Settings actions
  const updateSettings = async (updates: Partial<SalonSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(updated));
      return updated;
    });
  };

  // Availability actions
  const updateAvailability = async (newAvailability: AvailabilitySettings) => {
    setAvailability(newAvailability);
    localStorage.setItem(STORAGE_KEYS.availability, JSON.stringify(newAvailability));
  };

  // Income tracking functions
  const addIncome = (amount: number, note?: string, date?: string) => {
    const newEntry: IncomeEntry = {
      id: `inc-${Date.now()}`,
      date: date || new Date().toISOString().split('T')[0],
      amount,
      note,
      createdAt: new Date().toISOString()
    };
    setIncomeEntries(prev => {
      const updated = [...prev, newEntry];
      localStorage.setItem(STORAGE_KEYS.income, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteIncome = (id: string) => {
    setIncomeEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEYS.income, JSON.stringify(updated));
      return updated;
    });
  };

  // Gallery actions
  const addGalleryImage = (url: string, category: GalleryCategory, caption?: string) => {
    const newImage: GalleryImage = {
      id: `gallery-${Date.now()}`,
      url,
      category,
      caption,
      createdAt: new Date().toISOString(),
    };
    setGalleryImages(prev => {
      const updated = [newImage, ...prev];
      localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteGalleryImage = (id: string) => {
    setGalleryImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle VIP status for clients
  const toggleClientVIP = (clientId: string) => {
    setClients(prev => {
      const updated = prev.map(c => {
        if (c.id === clientId) {
          const hasVIP = c.tags.includes('VIP');
          return {
            ...c,
            tags: hasVIP 
              ? c.tags.filter(t => t !== 'VIP')
              : [...c.tags, 'VIP']
          };
        }
        return c;
      });
      localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate dashboard stats
  const dashboardStats = useMemo((): DashboardStats => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    // Income calculations
    const todayEarnings = incomeEntries
      .filter(e => e.date === todayStr)
      .reduce((sum, e) => sum + e.amount, 0);

    const weekEarnings = incomeEntries
      .filter(e => {
        const date = parseISO(e.date);
        return isWithinInterval(date, { start: weekStart, end: weekEnd });
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const monthEarnings = incomeEntries
      .filter(e => {
        const date = parseISO(e.date);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, e) => sum + e.amount, 0);

    // Booking stats
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const completedBookings = bookings.filter(b => b.status === 'completed').length;

    // Client stats
    const totalClients = clients.length;
    const vipClients = clients.filter(c => c.tags.includes('VIP')).length;
    const newClientsThisMonth = clients.filter(c => {
      const date = parseISO(c.createdAt);
      return isWithinInterval(date, { start: monthStart, end: monthEnd });
    }).length;

    return {
      totalBookings,
      pendingBookings,
      completedBookings,
      totalClients,
      newClientsThisMonth,
      vipClients,
      todayEarnings,
      weekEarnings,
      monthEarnings
    };
  }, [bookings, clients, incomeEntries]);

  // Get day name from date
  const getDayName = (date: Date): keyof AvailabilitySettings['weeklySchedule'] => {
    const days: (keyof AvailabilitySettings['weeklySchedule'])[] = [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ];
    return days[date.getDay()];
  };

  // Check if a specific date is available for booking
  const isDayAvailable = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if date is blocked
    if (availability.blockedDates.some(b => b.date === dateStr)) {
      return false;
    }
    
    // Check if day of week is open
    const dayName = getDayName(date);
    return availability.weeklySchedule[dayName].isOpen;
  };

  // Get available time slots for a specific date
  const getAvailableTimeSlots = (date: Date): string[] => {
    if (!isDayAvailable(date)) return [];
    
    const dayName = getDayName(date);
    const schedule = availability.weeklySchedule[dayName];
    
    if (!schedule.isOpen) return [];
    
    const slots: string[] = [];
    const [startHour] = schedule.startTime.split(':').map(Number);
    const [endHour] = schedule.endTime.split(':').map(Number);
    const slotDuration = availability.slotDurationMinutes / 60; // in hours
    const dateStr = date.toISOString().split('T')[0];
    
    // Get most up-to-date bookings from localStorage (for real-time sync)
    let currentBookings = bookings;
    try {
      const storedBookings = localStorage.getItem(STORAGE_KEYS.bookings);
      if (storedBookings) {
        currentBookings = JSON.parse(storedBookings);
      }
    } catch (e) {
      // Use state bookings if localStorage fails
    }
    
    // Generate time slots based on working hours
    for (let hour = startHour; hour + slotDuration <= endHour; hour += slotDuration) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      
      // Count how many bookings exist for this slot
      const bookingsForSlot = currentBookings.filter(
        b => b.date === dateStr && b.startTime === timeSlot && b.status !== 'cancelled'
      ).length;
      
      // Check if slot is under the max bookings limit
      const maxBookings = availability.maxBookingsPerSlot || 1;
      if (bookingsForSlot < maxBookings) {
        slots.push(timeSlot);
      }
    }
    
    return slots;
  };
  
  // Get all time slots with their booking status (for showing taken slots)
  const getAllTimeSlotsWithStatus = (date: Date): Array<{ time: string; available: boolean; bookedCount: number }> => {
    if (!isDayAvailable(date)) return [];
    
    const dayName = getDayName(date);
    const schedule = availability.weeklySchedule[dayName];
    
    if (!schedule.isOpen) return [];
    
    const slots: Array<{ time: string; available: boolean; bookedCount: number }> = [];
    const [startHour] = schedule.startTime.split(':').map(Number);
    const [endHour] = schedule.endTime.split(':').map(Number);
    const slotDuration = availability.slotDurationMinutes / 60;
    const dateStr = date.toISOString().split('T')[0];
    
    // Get most up-to-date bookings
    let currentBookings = bookings;
    try {
      const storedBookings = localStorage.getItem(STORAGE_KEYS.bookings);
      if (storedBookings) {
        currentBookings = JSON.parse(storedBookings);
      }
    } catch (e) {}
    
    for (let hour = startHour; hour + slotDuration <= endHour; hour += slotDuration) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      
      const bookingsForSlot = currentBookings.filter(
        b => b.date === dateStr && b.startTime === timeSlot && b.status !== 'cancelled'
      ).length;
      
      const maxBookings = availability.maxBookingsPerSlot || 1;
      
      slots.push({
        time: timeSlot,
        available: bookingsForSlot < maxBookings,
        bookedCount: bookingsForSlot
      });
    }
    
    return slots;
  };

  // Auth - default PIN is 67771
  const DEFAULT_PIN = '67771';
  const authenticateAdmin = async (pin: string): Promise<boolean> => {
    const validPin = settings.adminPin || DEFAULT_PIN;
    
    // Check against settings PIN or default
    if (pin === validPin) {
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
  // Get client by ID - checks state first, then localStorage for newly added clients
  const getClientById = (id: string): Client | undefined => {
    // First check current state
    let client = clients.find(c => c.id === id);
    
    // If not found, check localStorage (client might have been added in another tab/session)
    if (!client) {
      try {
        const storedClients = localStorage.getItem(STORAGE_KEYS.clients);
        if (storedClients) {
          const clientsList: Client[] = JSON.parse(storedClients);
          client = clientsList.find(c => c.id === id);
          
          // If found in localStorage but not in state, sync the state
          if (client && !clients.find(c => c.id === id)) {
            setClients(clientsList);
          }
        }
      } catch (e) {
        console.error('Error reading clients from localStorage:', e);
      }
    }
    
    return client;
  };
  
  const getBookingById = (id: string) => bookings.find(b => b.id === id);
  
  // Generate WhatsApp link to contact the SALON (for booking confirmation)
  const generateWhatsAppLink = (booking: Booking): string => {
    const client = getClientById(booking.clientId);
    const serviceNames = booking.services
      .map(id => getServiceById(id)?.name)
      .filter(Boolean)
      .join(', ');
    
    // Use the salon's WhatsApp number from settings (fallback to default)
    const salonPhone = (settings.whatsappNumber || '+905338709271').replace(/\D/g, '');
    
    const message = settings.whatsappTemplate
      .replace('{clientName}', client?.name || 'Guest')
      .replace('{serviceName}', serviceNames || 'Appointment')
      .replace('{date}', booking.date)
      .replace('{time}', booking.startTime)
      .replace('{id}', booking.id);
    
    // Send TO the salon's WhatsApp number so they receive the booking
    return `https://wa.me/${salonPhone}?text=${encodeURIComponent(message)}`;
  };

  const refreshData = async () => {
    await fetchAllData();
  };
  
  const value: SalonContextType = {
    services,
    staff,
    clients,
    bookings,
    settings,
    availability,
    incomeEntries,
    dashboardStats,
    isLoading,
    error,
    isOnline,
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
    updateAvailability,
    addIncome,
    deleteIncome,
    galleryImages,
    addGalleryImage,
    deleteGalleryImage,
    bookingAlert,
    clearBookingAlert,
    isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin,
    getServiceById,
    getStaffById,
    getClientById,
    getBookingById,
    generateWhatsAppLink,
    getAvailableTimeSlots,
    getAllTimeSlotsWithStatus,
    isDayAvailable,
    toggleClientVIP,
    refreshData,
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
