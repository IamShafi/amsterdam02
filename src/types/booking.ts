export interface TourTime {
  tour_time: string;
  tour_title: string;
}

export interface AvailabilityResponse {
  tour_time: string;
  tour_title: string;
  total_booked: number;
  available_spots: number;
  is_available: boolean;
}

export interface BookingRequest {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  country?: string;
  tour_date: string;
  tour_time: string;
  tour_title: string;
  num_people: number;
  notes?: string;
  potential_big_group?: boolean;
}

export interface BookingResponse {
  id: string;
  website_booking_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  country?: string;
  tour_date: string;
  tour_time: string;
  tour_title: string;
  num_people: number;
  status: 'scheduled' | 'cancelled';
  ip_address?: string;
  created_at?: string;
}

export interface BookingDetails extends BookingResponse {
  notes?: string;
}

export interface ApiError {
  error: string;
  available_spots?: number;
}
