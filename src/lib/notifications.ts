// Browser Notification System for New Bookings

// Notification sound (base64 encoded short beep)
const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+fnp2dlZGLhX53cWpkXldRSkM8NzQxLy4sKikn';

// Audio context is created per-sound, not stored globally

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Play notification sound
export const playNotificationSound = () => {
  try {
    // Create a new audio context for each sound
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    
    // Create oscillator for beep sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Configure the beep
    oscillator.frequency.value = 880; // A5 note
    oscillator.type = 'sine';
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    // Play the beep
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
    
    // Play a second beep
    setTimeout(() => {
      const oscillator2 = ctx.createOscillator();
      const gainNode2 = ctx.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(ctx.destination);
      
      oscillator2.frequency.value = 1100; // Higher note
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      oscillator2.start(ctx.currentTime);
      oscillator2.stop(ctx.currentTime + 0.3);
    }, 150);
    
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Show browser notification - AUTO DISMISS (no click required)
export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      requireInteraction: false,
      silent: false,
      ...options,
    });
    
    // Play sound when notification is shown
    playNotificationSound();
    
    // Auto-close after 5 seconds (no click needed)
    setTimeout(() => notification.close(), 5000);
    
    return notification;
  }
  return null;
};

// Show new booking notification
export const showNewBookingNotification = (clientName: string, date: string, time: string) => {
  return showNotification(`🎉 New Booking!`, {
    body: `${clientName} booked for ${date} at ${time}`,
    tag: 'new-booking',
  });
};

// Check if notifications are enabled
export const areNotificationsEnabled = (): boolean => {
  return 'Notification' in window && Notification.permission === 'granted';
};

// Get notification permission status
export const getNotificationStatus = (): 'granted' | 'denied' | 'default' | 'unsupported' => {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
};

// Badge API for Android PWA - shows count on home screen icon
export const updateAppBadge = (count: number) => {
  if ('setAppBadge' in navigator) {
    if (count > 0) {
      (navigator as Navigator & { setAppBadge: (count: number) => Promise<void> })
        .setAppBadge(count)
        .catch(() => {});
    } else {
      clearAppBadge();
    }
  }
};

// Clear the badge
export const clearAppBadge = () => {
  if ('clearAppBadge' in navigator) {
    (navigator as Navigator & { clearAppBadge: () => Promise<void> })
      .clearAppBadge()
      .catch(() => {});
  }
};
