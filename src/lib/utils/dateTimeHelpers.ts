import { format, parse } from 'date-fns';

export function convertTo24Hour(time12h: string): string {
  // Convert "10:00 AM" or "2:00 PM" to "10:00" or "14:00"
  try {
    const parsed = parse(time12h, 'h:mm a', new Date());
    return format(parsed, 'HH:mm');
  } catch {
    return time12h;
  }
}

export function convertTo12Hour(time24h: string): string {
  // Convert "10:00:00" or "14:00" to "10:00 AM" or "2:00 PM"
  try {
    const timeWithoutSeconds = time24h.split(':').slice(0, 2).join(':');
    const parsed = parse(timeWithoutSeconds, 'HH:mm', new Date());
    return format(parsed, 'h:mm a');
  } catch {
    return time24h;
  }
}

export function formatDateForAPI(date: Date): string {
  // Convert to "2025-11-15"
  return format(date, 'yyyy-MM-dd');
}

export function formatDateForDisplay(date: Date): string {
  // Convert to "Saturday, 8 Nov 2025"
  return format(date, 'EEEE, d MMM yyyy');
}

export function formatDateForModifyAPI(date: Date): string {
  // Convert to "Friday, nov 15, 2025"
  return format(date, 'EEEE, MMM d, yyyy');
}
