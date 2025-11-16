export type ErrorType =
  | 'FULLY_BOOKED'
  | 'INSUFFICIENT_SPOTS'
  | 'NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN';

export interface HandledError {
  type: ErrorType;
  message: string;
  userMessage: string;
  availableSpots?: number;
}

export function handleBookingError(error: any): HandledError {
  const errorMessage = error?.message || String(error);

  // Fully booked
  if (errorMessage.includes('fully booked')) {
    return {
      type: 'FULLY_BOOKED',
      message: errorMessage,
      userMessage: 'Sorry, this tour is fully booked. Please select a different time.',
    };
  }

  // Not enough spots
  if (errorMessage.includes('Not enough spots')) {
    const spotsMatch = errorMessage.match(/Only (\d+) spots/);
    const spots = spotsMatch ? parseInt(spotsMatch[1]) : 0;
    return {
      type: 'INSUFFICIENT_SPOTS',
      message: errorMessage,
      userMessage: `Only ${spots} spot${spots !== 1 ? 's' : ''} remaining. Please reduce the number of guests or select another time.`,
      availableSpots: spots,
    };
  }

  // Booking not found
  if (errorMessage.includes('not found') || errorMessage.includes('Not found')) {
    return {
      type: 'NOT_FOUND',
      message: errorMessage,
      userMessage: 'Booking not found. Please check your booking ID.',
    };
  }

  // Validation errors
  if (
    errorMessage.includes('required') ||
    errorMessage.includes('invalid') ||
    errorMessage.includes('Invalid')
  ) {
    return {
      type: 'VALIDATION_ERROR',
      message: errorMessage,
      userMessage: errorMessage,
    };
  }

  // Network error
  if (!navigator.onLine) {
    return {
      type: 'NETWORK_ERROR',
      message: 'No internet connection',
      userMessage: 'Please check your internet connection and try again.',
    };
  }

  // Default error
  return {
    type: 'UNKNOWN',
    message: errorMessage,
    userMessage: 'An unexpected error occurred. Please try again.',
  };
}
