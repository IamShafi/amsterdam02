'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addDays, isToday } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { CalendarIcon, Clock, Users, Star, Coins, Loader2, ChevronsUpDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

// import confetti from "canvas-confetti";
import { getAvailableTourTimes, checkAvailability, createBooking, updateBooking, cancelBooking, checkBookingExists, getBookingByEmail } from "@/lib/api/bookingService";
import { handleBookingError } from "@/lib/api/errorHandler";
import { supabase } from "@/integrations/supabase/client";
import { formatDateForAPI, convertTo24Hour, convertTo12Hour, formatDateForDisplay } from "@/lib/utils/dateTimeHelpers";
import type { TourTime, AvailabilityResponse } from "@/types/booking";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from "@/components/ui/popover";

import { COUNTRIES } from "@/lib/mockdata"

interface BookingDrawerContentProps {
  onClose?: () => void;
}


const BookingDrawerContent = ({ onClose }: BookingDrawerContentProps) => {
  const [step, setStep] = useState(1);
  const [hasTransitioned, setHasTransitioned] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [isCountryInputFocused, setIsCountryInputFocused] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [bookingId, setBookingId] = useState<string>();
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneStepLoading, setIsPhoneStepLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [tourTimes, setTourTimes] = useState<TourTime[]>([]);
  const [availability, setAvailability] = useState<AvailabilityResponse[]>([]);
  const [existingBooking, setExistingBooking] = useState<{
    date: string;
    time: string;
    persons: number;
    booking_code: string;
    customer_phone: string;
    customer_name: string;
    customer_email: string;
    country?: string;
  } | null>(null);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  
  // Private tour state
  const [isPrivateTourRequest, setIsPrivateTourRequest] = useState(false);
  const [privateTourGuests, setPrivateTourGuests] = useState(4);
  const [privateTourName, setPrivateTourName] = useState("");
  const [privateTourEmail, setPrivateTourEmail] = useState("");
  const [privateTourCountry, setPrivateTourCountry] = useState("");
  const [privateTourPhone, setPrivateTourPhone] = useState("");
  const [privateTourPhoneError, setPrivateTourPhoneError] = useState<string | null>(null);
  const [privateTourEmailError, setPrivateTourEmailError] = useState<string | null>(null);
  const [hasSelectedOver6, setHasSelectedOver6] = useState(false);
  
  const router = useRouter();

  // Fetch initial data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingInitial(true);
      try {
        // Fetch tour times
        const times = await getAvailableTourTimes();
        setTourTimes(times);
        
        // Fetch today's availability to determine button visibility
        const todayDate = formatDateForAPI(new Date());
        const availData = await checkAvailability(todayDate, null);
        setAvailability(availData);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setIsLoadingInitial(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch availability when date changes
  useEffect(() => {
    if (!date) return;
    
    const fetchAvailability = async () => {
      setIsLoadingAvailability(true);
      setAvailability([]); // Clear previous availability
      try {
        const availData = await checkAvailability(formatDateForAPI(date), null);
        setAvailability(availData);
      } catch (error) {
        console.error('Failed to check availability:', error);
      } finally {
        setIsLoadingAvailability(false);
      }
    };
    
    fetchAvailability();
    setSelectedTime("");
    setGuests(1);
    setShowTimeSlots(false);
  }, [date]);

  const transitionToStep = (newStep: number, direction: 'forward' | 'back' = 'forward') => {
    setIsGoingBack(direction === 'back');
    setHasTransitioned(true);
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(newStep);
      setIsTransitioning(false);
    }, 50);
  };

  const handleContinue = () => {
    if (!date || !selectedTime) {
      return;
    }
    setIsGoingBack(false);
    setStep(2);
  };

  const handleBooking = async () => {
    if (!name || !email || !date || !selectedTime) {
      return;
    }

    // Validate email format before submission
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error);
      return;
    }

    setIsLoading(true);
    
    try {
      // Check for duplicate booking
      setIsCheckingDuplicate(true);
      const bookingExists = await checkBookingExists(email);
      
      if (bookingExists) {
        // Get full booking details
        const existingBookingData = await getBookingByEmail(email);
        
        if (existingBookingData) {
          setExistingBooking(existingBookingData);
          setIsCheckingDuplicate(false);
          setIsLoading(false);
          
          // Transition to duplicate booking screen (new step 4)
          setIsGoingBack(false);
          setStep(4);
          return; // Exit early, don't create new booking
        }
      }
      setIsCheckingDuplicate(false);

      // Original booking creation logic
      const tourTitle = tourTimes.find(t => 
        convertTo24Hour(selectedTime) === t.tour_time
      )?.tour_title || '🏆 Amsterdam Original Tour';

      const booking = await createBooking({
        customer_name: name,
        customer_email: email,
        customer_phone: phone || "",
        tour_date: formatDateForAPI(date),
        tour_time: convertTo24Hour(selectedTime),
        tour_title: tourTitle,
        num_people: guests,
        notes: "",
        potential_big_group: hasSelectedOver6,
      });

      setBookingId(booking.website_booking_id);
      localStorage.setItem('lastBookingId', booking.website_booking_id);
      
      setIsGoingBack(false);
      setStep(3); // Phone number step
    } catch (error) {
      const handled = handleBookingError(error);
      console.error('Booking failed:', handled.userMessage);
      
      if (handled.type === 'FULLY_BOOKED' || handled.type === 'INSUFFICIENT_SPOTS') {
        // Refresh availability and go back to step 1
        if (date) {
          try {
            const availData = await checkAvailability(formatDateForAPI(date), null);
            setAvailability(availData);
          } catch (err) {
            console.error('Failed to refresh availability:', err);
          }
        }
        setStep(1);
      }
    } finally {
      setIsLoading(false);
      setIsCheckingDuplicate(false);
    }
  };

  const handleRescheduleToNew = async () => {
    if (!existingBooking || !name || !email || !date || !selectedTime) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Step 1: Cancel the existing booking
      await cancelBooking(existingBooking.booking_code, 
        `Rescheduled to ${formatDateForAPI(date)} at ${convertTo24Hour(selectedTime)}`
      );

      // Step 2: Create new booking with selected details
      const tourTitle = tourTimes.find(t => 
        convertTo24Hour(selectedTime) === t.tour_time
      )?.tour_title || '🏆 Amsterdam Original Tour';

      const booking = await createBooking({
        customer_name: name,
        customer_email: email,
        customer_phone: existingBooking.customer_phone || phone || "",
        tour_date: formatDateForAPI(date),
        tour_time: convertTo24Hour(selectedTime),
        tour_title: tourTitle,
        num_people: guests,
        notes: `Rescheduled from ${existingBooking.date} at ${existingBooking.time}`,
        potential_big_group: hasSelectedOver6,
      });

      // If country was in old booking, update new booking with it
      if (existingBooking.country && booking.website_booking_id) {
        await updateBooking(booking.website_booking_id, {
          country: existingBooking.country
        });
      }

      // Clear existing booking data
      setExistingBooking(null);
      
      // Navigate directly to thank you page (skip phone step)
      if (onClose) onClose();
      setTimeout(() => {
        router.push(`/thank-you?bookingId=${booking.website_booking_id}`);
      }, 300);

    } catch (error) {
      console.error('Reschedule failed:', error);
      const handled = handleBookingError(error);
      
      // Show error and possibly go back to step 1 if availability issue
      if (handled.type === 'FULLY_BOOKED' || handled.type === 'INSUFFICIENT_SPOTS') {
        if (date) {
          try {
            const availData = await checkAvailability(formatDateForAPI(date), null);
            setAvailability(availData);
          } catch (err) {
            console.error('Failed to refresh availability:', err);
          }
        }
        setExistingBooking(null);
        setStep(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Email validation helper function
  const validateEmail = (emailValue: string): { valid: boolean; error: string | null } => {
    if (!emailValue.trim()) {
      return { valid: false, error: "Email is required" };
    }
    
    // Comprehensive email regex pattern
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(emailValue.trim())) {
      return { valid: false, error: "Please enter a valid email address" };
    }
    
    // Additional checks for common issues
    if (emailValue.includes('..')) {
      return { valid: false, error: "Email cannot contain consecutive dots" };
    }
    
    if (emailValue.startsWith('.') || emailValue.startsWith('@')) {
      return { valid: false, error: "Please enter a valid email address" };
    }
    
    return { valid: true, error: null };
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
  };

  const handleEmailBlur = () => {
    if (email) {
      const validation = validateEmail(email);
      setEmailError(validation.error);
    }
  };

  // Phone validation helper functions
  const sanitizePhoneInput = (value: string): string => {
    return value.replace(/[^0-9]/g, '');
  };

  const validatePhone = (phoneValue: string, countryId: string): { valid: boolean; error: string | null } => {
    if (!phoneValue) return { valid: true, error: null }; // Optional field
    
    const country = COUNTRIES.find(c => c.id === countryId);
    if (!country) return { valid: false, error: "Invalid country selected" };
    
    return { valid: true, error: null };
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePhoneInput(e.target.value);
    setPhone(sanitized);
    
    const validation = validatePhone(sanitized, countryCode);
    setPhoneError(validation.error);
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const sanitized = sanitizePhoneInput(pastedText);
    setPhone(sanitized);
    
    const validation = validatePhone(sanitized, countryCode);
    setPhoneError(validation.error);
  };

  const handlePhoneStep = async () => {
    // Validate phone if provided
    if (phone) {
      const validation = validatePhone(phone, countryCode);
      if (!validation.valid) {
        setPhoneError(validation.error);
        return;
      }
    }

    // Set loading state to true before API call
    setIsPhoneStepLoading(true);

    // Update booking with phone and/or country
    if (bookingId && (phone || countryCode)) {
      try {
        const country = COUNTRIES.find((c) => c.id === countryCode);
        const updates: { customer_phone?: string; country?: string } = {};
        
        // Add phone number with country code if provided
        if (phone && country) {
          updates.customer_phone = country.code + phone;
        }
        
        // Always save country name if selected
        if (country) {
          updates.country = country.name;
        }
        
        await updateBooking(bookingId, updates);
      } catch (error) {
        console.error('Failed to update booking:', error);
        setIsPhoneStepLoading(false); // Reset on error
        return; // Exit early on error
      }
    }
    
    // Navigate to Thank You page
    if (onClose) onClose();
    setTimeout(() => {
      router.push(`/thank-you?bookingId=${bookingId}`);
    }, 300);
  };

  const handleClose = async () => {
    if (onClose) onClose();
    setTimeout(() => {
      router.push(`/thank-you?bookingId=${bookingId}`);
    }, 300);
  };

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  // Check if today still has available tours that haven't started yet
  const isTodayAvailable = () => {
    // During initial load, default to false to show tomorrow buttons
    if (isLoadingInitial) return false;
    
    // If no availability data, assume today is not available
    if (!availability.length) return false;
    
    const amsterdamTime = toZonedTime(new Date(), 'Europe/Amsterdam');
    const currentHour = amsterdamTime.getHours();
    const currentMinute = amsterdamTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    return availability.some(slot => {
      if (!slot.is_available) return false;
      
      const [hours, minutes] = slot.tour_time.split(':').map(Number);
      const tourTimeInMinutes = hours * 60 + minutes;
      
      // Tour is still available if it starts more than 30 minutes from now
      return tourTimeInMinutes > currentTimeInMinutes + 30;
    });
  };

  const showTodayButton = date && isToday(date) ? true : isTodayAvailable();
  const firstButtonDate = showTodayButton ? today : tomorrow;
  const firstButtonLabel = showTodayButton ? "Today" : "Tomorrow";
  const secondButtonDate = showTodayButton ? tomorrow : dayAfterTomorrow;
  const secondButtonLabel = showTodayButton ? "Tomorrow" : "Day after Tomorrow";

  // Calculate progress based on step and selections
  const calculateProgress = () => {
    if (step === 1) {
      if (!date) return 0;
      if (!guests || guests === 1) return 25;
      if (!showTimeSlots) return 50;
      if (!selectedTime) return 75;
      return 75;
    }
    if (step === 2) return 85;
    if (step === 3) return 95;
    if (step === 4) return 90; // Duplicate check screen
    if (step === 5) return 30; // Private tour guest selection
    if (step === 6) return 70; // Private tour contact form
    if (step === 7) return 100; // Private tour confirmation
    return 95;
  };

  // Calculate private tour pricing
  const calculatePrivateTourPrice = (numGuests: number) => {
    if (numGuests <= 10) {
      const exactPrice = 249 / numGuests;
      const roundedDown = Math.floor(exactPrice);
      const perPerson = roundedDown + 0.95;
      return {
        total: 249,
        perPerson: perPerson.toFixed(2)
      };
    } else {
      return {
        total: 249,
        perPerson: "24.95"
      };
    }
  };

  // Handle private tour request submission
  const handlePrivateTourSubmit = async () => {
    // Validate all fields
    if (!privateTourName.trim()) return;
    if (!privateTourEmail.trim()) return;
    if (!privateTourCountry) return;
    if (!privateTourPhone.trim()) return;

    const emailValidation = validateEmail(privateTourEmail);
    if (!emailValidation.valid) {
      setPrivateTourEmailError(emailValidation.error);
      return;
    }

    const phoneValidation = validatePhone(privateTourPhone, privateTourCountry);
    if (!phoneValidation.valid) {
      setPrivateTourPhoneError(phoneValidation.error);
      return;
    }

    // Submit to external API
    try {
      const response = await fetch('https://ckgsdkifvijxxvjlhsaa.supabase.co/functions/v1/create-private-tour-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: privateTourName,
          customer_email: privateTourEmail,
          customer_phone: privateTourPhone,
          country: privateTourCountry,
          number_of_guests: privateTourGuests,
          preferred_date: date ? formatDateForAPI(date) : null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error types
        if (response.status === 403 && data.reason === 'IP_BLACKLISTED') {
          console.error('IP is blacklisted:', data);
        } else if (response.status === 400) {
          console.error('Validation error:', data.error);
        } else {
          console.error('API error:', data);
        }
        // Continue to confirmation even if API call fails
      } else {
        console.log('Private tour request submitted successfully:', data.request_id);
      }
    } catch (error) {
      console.error('Failed to submit private tour request:', error);
      // Continue to confirmation even if API call fails
    }

    // Move to confirmation step
    transitionToStep(7);
  };


  return (
    <div className="flex flex-col h-full max-h-full">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-muted mb-6">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>


      <div className="px-6 pb-4 flex-1 min-h-0 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        {step === 1 && (
          <div key="step-1" className={cn("will-change-transform", hasTransitioned ? (isGoingBack ? "animate-fade-in-left" : "animate-fade-in-horizontal") : "", isTransitioning && "pointer-events-none")}>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (date) {
                        setDate(undefined);
                        setShowCalendar(true);
                        setShowTimeSlots(false);
                        setSelectedTime("");
                      } else {
                        onClose?.();
                      }
                    }}
                    className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted transition-colors -ml-2"
                    aria-label={date ? "Go back to date selection" : "Close booking"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </button>
                  <h2 
                    key={date ? "choose-time" : "choose-date"}
                    className="text-2xl font-bold animate-in fade-in-0 zoom-in-95 duration-300"
                  >
                    {date ? "Choose Time" : "Choose Date"}
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">4.92</span>
                  <span className="text-muted-foreground">(3,409)</span>
              </div>
            </div>
          </div>

            <div className="space-y-3">
              {/* Quick Date Selection */}
              {(!date || showCalendar) && (
                <div>
                  {isLoadingInitial ? (
                    // Skeleton loading state
                    <div className="space-y-3">
                      <div className="flex justify-center gap-3 mb-3">
                        <Skeleton className="h-12 flex-1" />
                        <Skeleton className="h-12 flex-1" />
                      </div>
                      <Skeleton className="h-[320px] w-full" />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center gap-3 mb-3">
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 flex-1 font-medium",
                            date && format(date, "yyyy-MM-dd") === format(firstButtonDate, "yyyy-MM-dd")
                              ? "border-primary bg-primary/10 text-primary"
                              : ""
                          )}
                          onClick={() => {
                            setDate(firstButtonDate);
                            setShowCalendar(false);
                          }}
                        >
                          <span className="font-semibold text-base">{firstButtonLabel}</span>
                        </Button>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 flex-1 font-medium",
                            date && format(date, "yyyy-MM-dd") === format(secondButtonDate, "yyyy-MM-dd")
                              ? "border-primary bg-primary/10 text-primary"
                              : ""
                          )}
                          onClick={() => {
                            setDate(secondButtonDate);
                            setShowCalendar(false);
                          }}
                        >
                          <span className="font-semibold text-base">{secondButtonLabel}</span>
                        </Button>
                      </div>
                      
                      {/* Calendar */}
                      <div className="w-full pointer-events-auto">
                        <CustomCalendar
                          selected={date}
                          onSelect={(newDate) => {
                            setDate(newDate);
                            setShowCalendar(false);
                          }}
                          disabled={(date) => {
                            const checkDate = new Date(date);
                            checkDate.setHours(0, 0, 0, 0);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            
                            // Disable past days
                            if (checkDate < today) return true;
                            
                            // Check if all tours have passed for today
                            if (checkDate.getTime() === today.getTime()) {
                              const amsterdamTime = toZonedTime(new Date(), 'Europe/Amsterdam');
                              const currentHour = amsterdamTime.getHours();
                              const currentMinute = amsterdamTime.getMinutes();
                              const currentTimeInMinutes = currentHour * 60 + currentMinute;
                              
                              // Check if all tours have passed (tour must start more than 30 min from now)
                              const hasAvailableTour = tourTimes.some(tour => {
                                const [hours, minutes] = tour.tour_time.split(':').map(Number);
                                const tourTimeInMinutes = hours * 60 + minutes;
                                return tourTimeInMinutes > currentTimeInMinutes + 30;
                              });
                              
                              if (!hasAvailableTour) return true;
                            }
                            
                            return false;
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Selected Date Summary */}
              {date && !showCalendar && (
                <div className="flex items-center justify-between p-4 bg-card border rounded-lg mb-2">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Selected date</div>
                      <span className="font-semibold text-base">{format(date, "EEEE, MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDate(undefined);
                      setShowCalendar(true);
                      setShowTimeSlots(false);
                      setSelectedTime("");
                    }}
                    className="h-9"
                  >
                    Edit
                  </Button>
                </div>
              )}

              {/* Guests Selection */}
              {date && !showCalendar && !showTimeSlots && (
                <div>
                  <Label className="text-base font-semibold mb-2 block">Number of Guests</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-14 w-14"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                    >
                      -
                    </Button>
                    <div className="flex-1 flex items-center justify-center gap-2 h-14 border rounded-md">
                      <Users className="h-6 w-6" />
                      <span className="font-semibold text-xl">{guests}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-14 w-14"
                      onClick={() => {
                        setGuests(guests + 1);
                        if (guests + 1 > 6) {
                          setHasSelectedOver6(true);
                        }
                      }}
                    >
                      +
                    </Button>
                  </div>
                  
                  {/* Warning for potential big groups trying to game the system */}
                  {hasSelectedOver6 && guests <= 6 && (
                    <div className="mt-3 p-3 bg-muted/50 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> This tour is for groups up to 6. Bigger groups will be turned away at the meeting spot. For bigger groups we recommend booking a private tour for a more enjoyable experience.
                      </p>
                    </div>
                  )}
                  
                  {guests > 6 && (
                    <div className="mt-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="text-sm font-medium mb-2">
                        <strong>Large group?</strong> For groups bigger than 6 we offer private tours. You can request a private tour by filling in your details below and one of our guides will contact you.
                      </p>
                    </div>
                  )}

                  <Button
                    className="w-full mt-4 h-12 text-base font-semibold"
                    onClick={() => {
                      if (guests > 6) {
                        setIsPrivateTourRequest(true);
                        setPrivateTourGuests(guests);
                        transitionToStep(5);
                      } else {
                        setShowTimeSlots(true);
                      }
                    }}
                  >
                    {guests > 6 ? 'Request Private Tour' : 'Show Available Tours'}
                  </Button>
                </div>
              )}

              {/* Selected Guests Summary */}
              {showTimeSlots && !selectedTime && (
                <div className="flex items-center justify-between p-4 bg-card border rounded-lg mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Guests</div>
                      <span className="font-semibold text-base">{guests} {guests === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowTimeSlots(false);
                      setSelectedTime("");
                    }}
                    className="h-9"
                  >
                    Edit
                  </Button>
                </div>
              )}

              {/* Time Selection - Only show times with enough spots for selected guests */}
              {showTimeSlots && !selectedTime && (
                <div>
                  <Label className="text-base font-semibold mb-2 block">Available Times for {guests} {guests === 1 ? 'Person' : 'People'}</Label>
                  {isLoadingAvailability ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : availability.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No times available for this date
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {availability
                        .filter((slot) => {
                          // Filter out past times if date is today
                          if (!date || !isToday(date)) {
                            // Filter by available spots for selected guests
                            return slot.available_spots >= guests;
                          }
                          
                          const amsterdamTime = toZonedTime(new Date(), 'Europe/Amsterdam');
                          const currentHour = amsterdamTime.getHours();
                          const currentMinute = amsterdamTime.getMinutes();
                          
                          const [tourHour, tourMinute] = slot.tour_time.split(':').map(Number);
                          const tourTimeInMinutes = tourHour * 60 + tourMinute;
                          const currentTimeInMinutes = currentHour * 60 + currentMinute;
                          
                          // Filter by both time and available spots
                          return tourTimeInMinutes > currentTimeInMinutes && slot.available_spots >= guests;
                        })
                        .map((slot) => {
                        const time12h = convertTo12Hour(slot.tour_time);
                        return (
                          <button
                            key={slot.tour_time}
              onClick={() => {
                setSelectedTime(time12h);
                transitionToStep(2);
              }}
                            disabled={!slot.is_available}
                            className={cn(
                              "relative flex items-center justify-between p-4 rounded-lg border-2 transition-colors",
                              selectedTime === time12h
                                ? "border-primary bg-primary/5"
                                : slot.is_available
                                ? "border-border md:hover:border-primary/50"
                                : "border-border opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5" />
                              <span className="font-medium text-base">{time12h}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs text-muted-foreground">English • 2.5 hours</span>
                              {slot.is_available && slot.available_spots <= 6 && (
                                <span className="text-xs text-[#fa6115] font-medium flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#fa6115]"></span>
                                  Only {slot.available_spots} spots left
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      {(() => {
                        const filteredSlots = availability.filter((slot) => {
                          if (!date || !isToday(date)) {
                            return slot.available_spots >= guests;
                          }
                          const amsterdamTime = toZonedTime(new Date(), 'Europe/Amsterdam');
                          const currentHour = amsterdamTime.getHours();
                          const currentMinute = amsterdamTime.getMinutes();
                          const [tourHour, tourMinute] = slot.tour_time.split(':').map(Number);
                          return (tourHour * 60 + tourMinute) > (currentHour * 60 + currentMinute) && slot.available_spots >= guests;
                        });
                        
                        if (filteredSlots.length === 0) {
                          return (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground mb-2">
                                No times available for {guests} {guests === 1 ? 'person' : 'people'} on this date.
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setShowTimeSlots(false);
                                  setGuests(Math.max(1, guests - 1));
                                }}
                              >
                                Try Fewer Guests
                              </Button>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Selected Time Display with Edit */}
              {selectedTime && !showCalendar && !isTransitioning && (
                <div className="mb-2">
                  <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground mb-0.5">Time selected</div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-base text-primary">{selectedTime}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTime("")}
                      className="h-9"
                    >
                       Edit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div key="step-2" className={cn("will-change-transform", isGoingBack ? "animate-fade-in-left" : "animate-fade-in-horizontal", isTransitioning && "pointer-events-none")}>
            <div className="mb-3">
              <div className="flex items-center gap-3 mb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    transitionToStep(1, 'back');
                    setSelectedTime("");
                    setShowTimeSlots(true);
                  }}
                  className="h-8 w-8 -ml-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </Button>
                <h2 className="text-2xl font-bold">Your Details</h2>
                <div className="flex items-center gap-1 text-sm ml-auto">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">4.92</span>
                  <span className="text-muted-foreground">(3,409)</span>
                </div>
              </div>
            </div>

            {/* Booking Overview Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5 mb-2 min-w-0">
              <div className="flex items-center justify-center gap-2 text-sm flex-nowrap whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{date && format(date, "EEE, MMM d")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{selectedTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <Label htmlFor="name" className="text-lg font-semibold mb-1.5 block">Full name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 text-lg"
                  data-vaul-no-drag
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-lg font-semibold mb-1.5 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    className={cn(
                      "h-14 text-lg",
                      emailError && "border-red-500 focus-visible:ring-red-500"
                    )}
                    data-vaul-no-drag
                  />
                {emailError && (
                  <p className="text-sm text-red-500 mt-2 font-medium">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Confirm Button */}
              <div className="!mt-6 !mb-3">
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-semibold"
                  onClick={handleBooking}
                  disabled={isLoading || !name.trim() || !email.trim() || !!emailError}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>

              {/* Pay What You Want Banner */}
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Pay What You Want</p>
                    <p className="text-xs text-muted-foreground">Free to book • Tip your guide at the end based on your experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div key="step-3" className={cn("will-change-transform", isGoingBack ? "animate-fade-in-left" : "animate-fade-in-horizontal", isTransitioning && "pointer-events-none")}>
            <div className="mb-6">
              <h2 className="text-3xl md:text-2xl font-semibold text-foreground">
                How can we reach you?
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold mb-2 block">
                  Country
                </Label>
              <Popover open={countryOpen} onOpenChange={setCountryOpen} modal={false}>
                <PopoverAnchor>
                  <div className="relative" data-vaul-no-drag>
                    {countryCode ? (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg z-10 pointer-events-none">
                        {COUNTRIES.find((c) => c.id === countryCode)?.emoji}
                      </span>
                    ) : (
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 z-10 pointer-events-none" style={{ color: '#fa6115' }} />
                    )}
                    <Input
                      value={
                        countryOpen || isCountryInputFocused
                          ? countrySearch
                          : countryCode
                            ? (() => {
                                const country = COUNTRIES.find((c) => c.id === countryCode);
                                return country ? `${country.code} (${country.name})` : "";
                              })()
                            : countrySearch
                      }
                  onChange={(e) => {
                    setCountrySearch(e.target.value);
                    setCountryCode("");
                    setCountryOpen(e.target.value.trim().length > 0);
                  }}
                      onFocus={() => setIsCountryInputFocused(true)}
                      onBlur={() => setIsCountryInputFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown" && !countryOpen && countrySearch.trim()) {
                          setCountryOpen(true);
                        } else if (e.key === "Escape") {
                          setCountryOpen(false);
                        }
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="h-14 w-full font-normal pr-20 pl-10 text-lg"
                      placeholder="Search country..."
                      data-vaul-no-drag
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <ChevronsUpDown
                        className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCountryOpen((o) => !o);
                        }}
                        aria-label="Toggle country suggestions"
                      />
                    </div>
                  </div>
                </PopoverAnchor>
              <PopoverContent 
                side="bottom"
                align="start"
                avoidCollisions={false}
                collisionPadding={0}
                sideOffset={4}
                className="w-[var(--radix-popper-anchor-width)] p-0 max-h-72 overflow-y-auto z-[9999]" 
                style={{ zIndex: 9999 }}
                data-vaul-no-drag
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                    <Command shouldFilter={false}>
                      <CommandList data-vaul-no-drag>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {COUNTRIES.filter((country) => {
                            const searchRaw = countrySearch.trim();
                            if (!searchRaw) return false;
                            
                            const searchLower = searchRaw.toLowerCase();
                            const searchDigits = searchRaw.replace(/\D/g, "");
                            
                            // Alias for "The Netherlands" - matches both "Ne" and "Th"
                            const THE_PREFIX_IDS = new Set(["nl"]);
                            
                            // Name token prefix matching (supports spaces and hyphens)
                            const nameTokens = country.name.toLowerCase().split(/[\s-]+/).filter(Boolean);
                            const aliasTokens = THE_PREFIX_IDS.has(country.id) ? ["the"] : [];
                            const tokens = [...nameTokens, ...aliasTokens];
                            const nameMatch = tokens.some((t) => t.startsWith(searchLower));
                            
                            // Country code prefix matching - supports "+31" and "31"
                            const codePlain = country.code.toLowerCase().replace(/[\s-]+/g, "");
                            const codeDigits = country.code.replace(/\D/g, "");
                            const queryIsPlus = searchLower.startsWith("+");
                            const codeMatch = queryIsPlus
                              ? codePlain.startsWith(searchLower.replace(/[\s-]+/g, ""))
                              : (searchDigits.length > 0 && codeDigits.startsWith(searchDigits));
                            
                            // Country id prefix match (e.g. "nl")
                            const idMatch = country.id.toLowerCase().startsWith(searchLower);
                            
                            return nameMatch || codeMatch || idMatch;
                          }).map((country) => (
                            <CommandItem
                              key={country.id}
                              value={`${country.name} ${country.code}`}
                              onSelect={() => {
                                setCountryCode(country.id);
                                setCountrySearch("");
                                setCountryOpen(false);
                                // Re-validate phone with new country
                                if (phone) {
                                  const validation = validatePhone(phone, country.id);
                                  setPhoneError(validation.error);
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-5 w-5",
                                  countryCode === country.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {country.emoji} {country.code} ({country.name})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="phone" className="text-lg font-semibold mb-2 block">
                  Phone Number
                </Label>
                <div className="flex gap-2">
                  {countryCode && (
                    <div className="flex items-center justify-center px-3 h-14 rounded-md border border-input bg-muted text-lg font-medium">
                      {(() => {
                        const country = COUNTRIES.find((c) => c.id === countryCode);
                        return country ? country.code : "+";
                      })()}
                    </div>
                  )}
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={(() => {
                      const country = COUNTRIES.find((c) => c.id === countryCode);
                      return country?.placeholder || "Select country first";
                    })()}
                    value={phone}
                    onChange={handlePhoneChange}
                    onPaste={handlePhonePaste}
                    disabled={!countryCode}
                    className={cn(
                      "h-14 text-lg",
                      countryCode ? "flex-1" : "w-full",
                      !countryCode && "cursor-not-allowed hover:border-input",
                      phoneError && "border-red-500 focus-visible:ring-red-500"
                    )}
                    data-vaul-no-drag
                  />
                </div>
                {phoneError && (
                  <p className="text-xs text-red-500 mt-2 font-medium">
                    {phoneError}
                  </p>
                )}
                {!phoneError && (
                  <p className="text-xs text-muted-foreground mt-2">
                    We'll send you updates here if anything changes so you're always up-to-date
                  </p>
                )}
              </div>

              <Button
                size="lg"
                className="w-full h-14 text-base font-semibold mt-2"
                onClick={handlePhoneStep}
                disabled={isPhoneStepLoading || !countryCode || !phone.trim() || !!phoneError}
              >
                {isPhoneStepLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && existingBooking && (
          <div key="step-4" className={cn("will-change-transform", "animate-fade-in-horizontal")}>
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#f562181a' }}>
                <CalendarIcon className="h-8 w-8" style={{ color: '#f56218' }} />
              </div>
              <h2 className="text-2xl font-bold mb-1 whitespace-nowrap">You Already Have a Booking</h2>
            </div>

            {/* Existing Booking Details Card */}
            <div className="bg-muted/50 border-2 border-muted rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3">Current Booking Details</h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="text-sm font-medium">
                    {format(new Date(existingBooking.date), 'EEEE, d MMM yyyy')}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="text-sm font-medium">{convertTo12Hour(existingBooking.time)}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="text-sm font-medium">
                    {existingBooking.persons} {existingBooking.persons === 1 ? 'Person' : 'People'}
                  </div>
                </div>
              </div>
            </div>

            {/* New Booking Details Card */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">NEW</span>
                Booking Details
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{date && format(date, 'EEEE, MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">{selectedTime || 'Time not selected'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Reschedule to New Time Button */}
              <Button
                size="lg"
                className="w-full h-14 text-base font-semibold"
                onClick={handleRescheduleToNew}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Rescheduling...
                  </>
                ) : (
                  <>
                    Reschedule to {date && format(date, 'MMM d')} {selectedTime ? `at ${selectedTime}` : '— Time not selected'}
                  </>
                )}
              </Button>

              {/* View/Modify Existing Booking Button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full h-14 text-base font-semibold"
                onClick={() => {
                  if (onClose) onClose();
                  router.push(`/view-booking/${existingBooking.booking_code}`);
                }}
              >
                View/Modify Current Booking
              </Button>

              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setExistingBooking(null);
                  transitionToStep(2, 'back');
                }}
              >
                Go Back
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div key="step-5" className={cn("will-change-transform", isGoingBack ? "animate-fade-in-left" : "animate-fade-in-horizontal", isTransitioning && "pointer-events-none")}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => transitionToStep(1, 'back')}
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted transition-colors -ml-2"
                  aria-label="Go back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                <h2 className="text-2xl font-bold">Request a Private Tour</h2>
              </div>
              <p className="text-muted-foreground">Enjoy Amsterdam with your own private guide - perfect for any group size</p>
            </div>

            {/* Guest Selection */}
            <div className="mb-5">
              <Label className="text-base font-semibold mb-2 block">How many people are joining?</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14"
                  onClick={() => setPrivateTourGuests(Math.max(1, privateTourGuests - 1))}
                  disabled={privateTourGuests <= 1}
                >
                  -
                </Button>
                <div className="flex-1 flex items-center justify-center gap-2 h-14 border rounded-md">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-xl">{privateTourGuests} {privateTourGuests === 1 ? 'person' : 'people'}</span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14"
                  onClick={() => setPrivateTourGuests(Math.min(30, privateTourGuests + 1))}
                  disabled={privateTourGuests >= 30}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-card border-2 border-primary rounded-lg p-5 mb-5">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-sm text-muted-foreground">Price per person</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-primary">€{calculatePrivateTourPrice(privateTourGuests).perPerson}</span>
                  <span className="text-xs text-muted-foreground">incl. Tax</span>
                </div>
              </div>
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Private tour guide</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Your group only</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>Free snack included</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>All taxes included</span>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              size="lg"
              className="w-full h-14 text-base font-semibold mb-5"
              onClick={() => transitionToStep(6)}
            >
              Continue to Contact Details
            </Button>

            {/* How It Works */}
            <div className="bg-muted/30 border border-border/50 rounded-lg p-4 mb-8">
              <h3 className="font-medium text-sm mb-3 text-muted-foreground">How Private Tours Work</h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Submit your request with your group size</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Our team contacts you within 24 hours</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Experience Amsterdam with your private guide</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div key="step-6" className={cn("will-change-transform", isGoingBack ? "animate-fade-in-left" : "animate-fade-in-horizontal", isTransitioning && "pointer-events-none")}>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => transitionToStep(5, 'back')}
                  className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted transition-colors -ml-2"
                  aria-label="Go back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                <h2 className="text-2xl font-bold">Your Contact Details</h2>
              </div>
            </div>

              <div className="space-y-4 mb-8">
              {/* Name */}
              <div>
                <Label htmlFor="private-name" className="text-lg font-semibold mb-1.5 block">Full Name *</Label>
                <Input
                  id="private-name"
                  placeholder="Your full name"
                  value={privateTourName}
                  onChange={(e) => setPrivateTourName(e.target.value)}
                  className="h-14 text-lg"
                  data-vaul-no-drag
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="private-email" className="text-lg font-semibold mb-1.5 block">Email Address *</Label>
                <Input
                  id="private-email"
                  type="email"
                  placeholder="your@email.com"
                  value={privateTourEmail}
                  onChange={(e) => {
                    setPrivateTourEmail(e.target.value);
                    setPrivateTourEmailError(null);
                  }}
                  onBlur={() => {
                    if (privateTourEmail) {
                      const validation = validateEmail(privateTourEmail);
                      setPrivateTourEmailError(validation.error);
                    }
                  }}
                  className={cn(
                    "h-14 text-lg",
                    privateTourEmailError && "border-red-500 focus-visible:ring-red-500"
                  )}
                  data-vaul-no-drag
                />
                {privateTourEmailError && (
                  <p className="text-sm text-red-500 mt-2 font-medium">
                    {privateTourEmailError}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <Label className="text-lg font-semibold mb-2 block">Country *</Label>
                <Popover open={countryOpen} onOpenChange={setCountryOpen} modal={false}>
                  <PopoverAnchor>
                    <div className="relative" data-vaul-no-drag>
                      {privateTourCountry ? (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg z-10 pointer-events-none">
                          {COUNTRIES.find((c) => c.id === privateTourCountry)?.emoji}
                        </span>
                      ) : (
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 z-10 pointer-events-none text-primary" />
                      )}
                      <Input
                        value={
                          countryOpen || isCountryInputFocused
                            ? countrySearch
                            : privateTourCountry
                              ? (() => {
                                  const country = COUNTRIES.find((c) => c.id === privateTourCountry);
                                  return country ? `${country.code} (${country.name})` : "";
                                })()
                              : countrySearch
                        }
                        onChange={(e) => {
                          setCountrySearch(e.target.value);
                          setPrivateTourCountry("");
                          setCountryOpen(e.target.value.trim().length > 0);
                        }}
                        onFocus={() => setIsCountryInputFocused(true)}
                        onBlur={() => setIsCountryInputFocused(false)}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowDown" && !countryOpen && countrySearch.trim()) {
                            setCountryOpen(true);
                          } else if (e.key === "Escape") {
                            setCountryOpen(false);
                          }
                        }}
                        className="h-14 w-full font-normal pr-20 pl-10 text-lg"
                        placeholder="Search country..."
                        data-vaul-no-drag
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <ChevronsUpDown
                          className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCountryOpen((o) => !o);
                          }}
                        />
                      </div>
                    </div>
                  </PopoverAnchor>
                  <PopoverContent 
                    side="bottom"
                    align="start"
                    avoidCollisions={false}
                    collisionPadding={0}
                    sideOffset={4}
                    className="w-[var(--radix-popper-anchor-width)] p-0 max-h-72 overflow-y-auto z-[9999]" 
                    data-vaul-no-drag
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <Command shouldFilter={false}>
                      <CommandList data-vaul-no-drag>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {COUNTRIES.filter((country) => {
                            const searchRaw = countrySearch.trim();
                            if (!searchRaw) return false;
                            const searchLower = searchRaw.toLowerCase();
                            const searchDigits = searchRaw.replace(/\D/g, "");
                            const nameTokens = country.name.toLowerCase().split(/[\s-]+/).filter(Boolean);
                            const nameMatch = nameTokens.some((t) => t.startsWith(searchLower));
                            const codePlain = country.code.toLowerCase().replace(/[\s-]+/g, "");
                            const codeDigits = country.code.replace(/\D/g, "");
                            const queryIsPlus = searchLower.startsWith("+");
                            const codeMatch = queryIsPlus
                              ? codePlain.startsWith(searchLower.replace(/[\s-]+/g, ""))
                              : (searchDigits.length > 0 && codeDigits.startsWith(searchDigits));
                            const idMatch = country.id.toLowerCase().startsWith(searchLower);
                            return nameMatch || codeMatch || idMatch;
                          }).map((country) => (
                            <CommandItem
                              key={country.id}
                              value={`${country.name} ${country.code}`}
                              onSelect={() => {
                                setPrivateTourCountry(country.id);
                                setCountrySearch("");
                                setCountryOpen(false);
                                if (privateTourPhone) {
                                  const validation = validatePhone(privateTourPhone, country.id);
                                  setPrivateTourPhoneError(validation.error);
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-5 w-5",
                                  privateTourCountry === country.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {country.emoji} {country.code} ({country.name})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="private-phone" className="text-lg font-semibold mb-2 block">Phone Number *</Label>
                <div className="flex gap-2">
                  {privateTourCountry && (
                    <div className="flex items-center justify-center px-3 h-14 rounded-md border border-input bg-muted text-lg font-medium">
                      {(() => {
                        const country = COUNTRIES.find((c) => c.id === privateTourCountry);
                        return country ? country.code : "+";
                      })()}
                    </div>
                  )}
                  <Input
                    id="private-phone"
                    type="tel"
                    placeholder={(() => {
                      const country = COUNTRIES.find((c) => c.id === privateTourCountry);
                      return country?.placeholder || "Select country first";
                    })()}
                    value={privateTourPhone}
                    onChange={(e) => {
                      const sanitized = sanitizePhoneInput(e.target.value);
                      setPrivateTourPhone(sanitized);
                      const validation = validatePhone(sanitized, privateTourCountry);
                      setPrivateTourPhoneError(validation.error);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedText = e.clipboardData.getData('text');
                      const sanitized = sanitizePhoneInput(pastedText);
                      setPrivateTourPhone(sanitized);
                      const validation = validatePhone(sanitized, privateTourCountry);
                      setPrivateTourPhoneError(validation.error);
                    }}
                    disabled={!privateTourCountry}
                    className={cn(
                      "h-14 text-lg",
                      privateTourCountry ? "flex-1" : "w-full",
                      !privateTourCountry && "cursor-not-allowed hover:border-input",
                      privateTourPhoneError && "border-red-500 focus-visible:ring-red-500"
                    )}
                    data-vaul-no-drag
                  />
                </div>
                {privateTourPhoneError && (
                  <p className="text-xs text-red-500 mt-2 font-medium">
                    {privateTourPhoneError}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                size="lg"
                className="w-full h-14 text-base font-semibold mt-2 mb-6"
                onClick={handlePrivateTourSubmit}
                disabled={
                  !privateTourName.trim() || 
                  !privateTourEmail.trim() || 
                  !privateTourCountry || 
                  !privateTourPhone.trim() || 
                  !!privateTourEmailError || 
                  !!privateTourPhoneError
                }
              >
                Send Private Tour Request
              </Button>
              
              <p className="text-xs text-muted-foreground mt-3 text-center">
                We'll contact you within 24 hours to finalize your private tour
              </p>
            </div>
          </div>
        )}

        {step === 7 && (
          <div key="step-7" className={cn("will-change-transform", "animate-fade-in-horizontal")}>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Request Received!</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Thank you for your interest in our private tours. One of our guides will reach out to you within 24 hours to finalize the details.
              </p>

              {/* Request Summary */}
              <div className="bg-card border rounded-lg p-4 w-full max-w-md mb-6">
                <h3 className="font-semibold mb-3">Your Request Summary</h3>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{privateTourName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{privateTourEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{privateTourPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preferred Date:</span>
                    <span className="font-medium text-right">{date ? formatDateForDisplay(date) : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests:</span>
                    <span className="font-medium">{privateTourGuests} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium text-primary">€{calculatePrivateTourPrice(privateTourGuests).perPerson} per person (incl. Tax)</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => { 
                  if (onClose) onClose(); 
                }} 
                className="w-full max-w-md h-12 text-base font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookingDrawerContent;
