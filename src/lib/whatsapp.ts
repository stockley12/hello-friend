/**
 * WhatsApp Utility Functions
 * Uses free wa.me links - no API costs!
 */

import { Booking, Client, SalonSettings } from '@/types';
import { format } from 'date-fns';

export interface WhatsAppMessage {
  phone: string;
  message: string;
  link: string;
}

/**
 * Formats phone number for WhatsApp (removes spaces, dashes, etc.)
 */
export function formatPhoneForWhatsApp(phone: string): string {
  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If starts with +, remove it (wa.me doesn't need it)
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // If starts with 0, assume it's a local number - you might want to add country code
  // For now, we'll keep it as-is
  
  return cleaned;
}

/**
 * Generates WhatsApp link to send CONFIRMATION message to customer
 */
export function generateConfirmationLink(
  booking: Booking,
  client: Client,
  settings: SalonSettings
): WhatsAppMessage {
  const formattedDate = format(new Date(booking.date), 'EEEE, MMMM d, yyyy');
  const formattedPhone = formatPhoneForWhatsApp(client.phone);
  
  const message = `✅ Hi ${client.name}!

Your appointment at ${settings.name} is *CONFIRMED*!

📅 Date: ${formattedDate}
🕐 Time: ${booking.startTime}
⏱️ Duration: 4 hours

📍 Location: ${settings.address}

We look forward to seeing you! If you need to reschedule, please contact us at least 24 hours in advance.

– ${settings.name} Team 💇‍♀️`;

  const link = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  return {
    phone: formattedPhone,
    message,
    link
  };
}

/**
 * Generates WhatsApp link to send CANCELLATION message to customer
 */
export function generateCancellationLink(
  booking: Booking,
  client: Client,
  settings: SalonSettings
): WhatsAppMessage {
  const formattedDate = format(new Date(booking.date), 'EEEE, MMMM d, yyyy');
  const formattedPhone = formatPhoneForWhatsApp(client.phone);
  
  const message = `Hi ${client.name},

We regret to inform you that your appointment on ${formattedDate} at ${booking.startTime} has been cancelled.

Please contact us to reschedule at your convenience.

📞 ${settings.phone}

– ${settings.name} Team`;

  const link = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  return {
    phone: formattedPhone,
    message,
    link
  };
}

/**
 * Generates WhatsApp link to send REMINDER message to customer
 */
export function generateReminderLink(
  booking: Booking,
  client: Client,
  settings: SalonSettings
): WhatsAppMessage {
  const formattedDate = format(new Date(booking.date), 'EEEE, MMMM d, yyyy');
  const formattedPhone = formatPhoneForWhatsApp(client.phone);
  
  const message = `⏰ Reminder: Hi ${client.name}!

This is a friendly reminder about your upcoming appointment:

📅 Date: ${formattedDate}
🕐 Time: ${booking.startTime}
📍 Location: ${settings.address}

See you soon!

– ${settings.name} Team 💇‍♀️`;

  const link = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  return {
    phone: formattedPhone,
    message,
    link
  };
}

/**
 * Opens WhatsApp with the given link
 */
export function openWhatsApp(link: string): void {
  window.open(link, '_blank', 'noopener,noreferrer');
}








