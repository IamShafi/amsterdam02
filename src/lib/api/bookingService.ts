import { SUPABASE_URL, headers } from './config';
import type {
  TourTime,
  AvailabilityResponse,
  BookingRequest,
  BookingResponse,
  BookingDetails,
} from '@/types/booking';

export async function getAvailableTourTimes(): Promise<TourTime[]> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/tour_times?active=eq.true&select=tour_time,tour_title`,
    { headers }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch tour times');
  }

  return response.json();
}

export async function checkAvailability(
  date: string,
  tourTime: string | null = null
): Promise<AvailabilityResponse[]> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/get_tour_availability`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        p_date: date,
        p_tour_time: tourTime,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to check availability');
  }

  return response.json();
}

export async function createBooking(
  bookingData: BookingRequest
): Promise<BookingResponse> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/create-website-booking`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to create booking');
  }

  return result.booking;
}

export async function getBookingDetails(
  websiteBookingId: string
): Promise<BookingDetails> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/get-website-booking?website_booking_id=${encodeURIComponent(
      websiteBookingId
    )}`,
    { headers }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to get booking details');
  }

  return result.booking;
}

// Update booking schedule (date, time, guests)
export async function updateBookingSchedule(
  websiteBookingId: string,
  updates: Partial<{
    tour_date: string;
    tour_time: string;
    num_people: number;
  }>
): Promise<BookingResponse> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/update-website-booking`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        website_booking_id: websiteBookingId,
        ...updates,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update booking');
  }

  return result.booking;
}

// Update booking contact info
export async function updateBooking(
  websiteBookingId: string,
  updates: Partial<{
    customer_phone: string;
    customer_email: string;
    customer_name: string;
    country: string;
    notes: string;
  }>
): Promise<BookingResponse> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/update-website-booking`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        website_booking_id: websiteBookingId,
        ...updates,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to update booking');
  }

  return result.booking;
}

export async function cancelBooking(
  websiteBookingId: string,
  reason?: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/cancel-booking`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        website_booking_id: websiteBookingId,
        reason,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to cancel booking');
  }

  return result;
}

// Check if booking exists for an email (fast check)
export async function checkBookingExists(email: string): Promise<boolean> {
  const response = await fetch(
    'https://ckgsdkifvijxxvjlhsaa.supabase.co/functions/v1/check-booking-by-email',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to check booking existence');
  }

  const data = await response.json();
  return data.exists;
}

// Get existing booking details by email
export async function getBookingByEmail(email: string): Promise<{
  date: string;
  time: string;
  persons: number;
  booking_code: string;
  customer_phone: string;
  customer_name: string;
  customer_email: string;
  country?: string;
} | null> {
  const response = await fetch(
    'https://ckgsdkifvijxxvjlhsaa.supabase.co/functions/v1/get-booking-by-email',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }
  );

  if (!response.ok) {
    // 404 means no booking found - this is okay
    if (response.status === 404) return null;
    throw new Error('Failed to get booking details');
  }

  const data = await response.json();
  return data.success ? data.booking : null;
}
