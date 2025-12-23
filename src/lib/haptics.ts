// Haptic Feedback utilities for mobile
export const haptics = {
  // Light tap feedback
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  
  // Medium feedback for selections
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  
  // Strong feedback for confirmations
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  },
  
  // Success pattern
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },
  
  // Error pattern
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50, 30, 50]);
    }
  },
  
  // Warning pattern
  warning: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 20, 30]);
    }
  },
  
  // Selection changed
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  },
};

// Check if haptics are supported
export const supportsHaptics = () => 'vibrate' in navigator;



