'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Calendar, Users } from "lucide-react";
import { addDays, format, isToday } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DateSelector } from "./booking/DateSelector";
import { GuestSelector } from "./booking/GuestSelector";
import { TourTimeCards } from "./booking/TourTimeCards";
import { checkAvailability } from "@/lib/api/bookingService";
import { formatDateForAPI } from "@/lib/utils/dateTimeHelpers";
import type { AvailabilityResponse } from "@/types/booking";


const BookingSidebar = () => {
  const router = useRouter();
  const [step, setStep] = useState<"date" | "guests" | "tours">("date");
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [availableTours, setAvailableTours] = useState<AvailabilityResponse[]>([]);
  const [isLoadingTours, setIsLoadingTours] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityResponse[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [hasSelectedOver6, setHasSelectedOver6] = useState(false);

  useEffect(() => {
    const fetchTodayAvailability = async () => {
      try {
        const todayFormatted = formatDateForAPI(new Date());
        const data = await checkAvailability(todayFormatted);
        setAvailability(data);
      } catch (error) {
        console.error("Error fetching today's availability:", error);
      } finally {
        setIsLoadingInitial(false);
      }
    };

    // ✅ STRATEGY 1: Wait for LCP before fetching (BEST)
    let lcpObserver: PerformanceObserver | null = null;
    let timeoutId: number | null = null;
    let idleCallbackId: number | null = null;

    if ('PerformanceObserver' in window) {
      try {
        lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            // LCP has fired, now we can safely fetch availability
            // console.log('✅ LCP detected, fetching availability...');
            
            // Use requestIdleCallback for additional safety
            if ('requestIdleCallback' in window) {
              idleCallbackId = requestIdleCallback(() => {
                fetchTodayAvailability();
              }, { timeout: 2000 }); // Max 2s wait
            } else {
              fetchTodayAvailability();
            }
            
            lcpObserver?.disconnect();
          }
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported, using fallback');
      }
    }

    // ✅ STRATEGY 2: Fallback - wait 1.5s if LCP observer fails
    timeoutId = window.setTimeout(() => {
      console.log('⏱️ Fallback timeout reached, fetching availability...');
      if ('requestIdleCallback' in window) {
        idleCallbackId = requestIdleCallback(() => {
          fetchTodayAvailability();
        }, { timeout: 2000 });
      } else {
        fetchTodayAvailability();
      }
    }, 1500);

    // Cleanup
    return () => {
      if (lcpObserver) lcpObserver.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
      if (idleCallbackId) cancelIdleCallback(idleCallbackId);
    };
  }, []);

  const isTodayAvailable = () => {
    if (isLoadingInitial) return false;
    if (!availability.length) return false;

    const amsterdamTime = toZonedTime(new Date(), "Europe/Amsterdam");
    const currentHour = amsterdamTime.getHours();
    const currentMinute = amsterdamTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    return availability.some((slot) => {
      if (!slot.is_available) return false;

      const [hours, minutes] = slot.tour_time.split(":").map(Number);
      const tourTimeInMinutes = hours * 60 + minutes;

      return tourTimeInMinutes > currentTimeInMinutes + 30;
    });
  };

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const dayAfterTomorrow = addDays(today, 2);

  const showTodayButton = date && isToday(date) ? true : isTodayAvailable();
  const firstButtonDate = showTodayButton ? today : tomorrow;
  const firstButtonLabel = showTodayButton ? "Today" : "Tomorrow";
  const secondButtonDate = showTodayButton ? tomorrow : dayAfterTomorrow;
  const secondButtonLabel = showTodayButton ? "Tomorrow" : "Day after Tomorrow";

  const handleFirstButton = () => {
    setDate(firstButtonDate);
    setStep("guests");
  };

  const handleSecondButton = () => {
    setDate(secondButtonDate);
    setStep("guests");
  };

  const handleDateSelect = async (selectedDate: Date) => {
    setDate(selectedDate);
    setStep("guests");
  
    setIsLoadingTours(true);
    try {
      const availability = await checkAvailability(formatDateForAPI(selectedDate));
      setAvailableTours(availability.filter((t) => t.is_available));
    } finally {
      setIsLoadingTours(false);
    }
  };
  

  const handleShowTours = async () => {
    if (!date) return;

    // If more than 6 guests, navigate to private tour page
    if (guests > 6) {
      const params = new URLSearchParams({
        date: formatDateForAPI(date),
        guests: guests.toString(),
      });
      router.push(`/book-private-tour?${params.toString()}`);
      return;
    }

    setIsLoadingTours(true);
    setStep("tours");

    try {
      const formattedDate = formatDateForAPI(date);
      const availability = await checkAvailability(formattedDate);
      setAvailableTours(availability.filter((t) => t.is_available));
    } catch (error) {
      toast.error("Failed to load available tours");
      console.error("Error loading tours:", error);
      setStep("guests");
    } finally {
      setIsLoadingTours(false);
    }
  };

  const handleTourSelect = (tour: AvailabilityResponse) => {
    const params = new URLSearchParams({
      date: formatDateForAPI(date!),
      guests: guests.toString(),
      tourTime: tour.tour_time,
      tourTitle: tour.tour_title,
      potentialBigGroup: hasSelectedOver6.toString(),
    });

    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div
      className="h-[calc(100vh-59px)] overflow-y-auto bg-card border border-black rounded-xl p-6 shadow-lg space-y-4 will-change-transform"
      style={{ contain: "layout paint" }} // Removed 'size' for better flexibility
    >
      {/* Price Header - Always Visible */}
      <div className="border-b pb-3">
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-bold text-primary">Free Booking</span>
          <p className="text-lg font-medium text-muted-foreground">
            Tip-Based Tour
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1 text-sm">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 fill-primary text-primary"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="font-semibold">4.92</span>
          <span className="text-muted-foreground">(3,409 reviews)</span>
        </div>
      </div>

      {/* Step 1: Date Selection */}
      {step === "date" && (
        <DateSelector
          date={date}
          firstButtonLabel={firstButtonLabel}
          secondButtonLabel={secondButtonLabel}
          onFirstButtonClick={handleFirstButton}
          onSecondButtonClick={handleSecondButton}
          onDateSelect={handleDateSelect}
          isLoading={isLoadingInitial}
        />
      )}

      {/* Step 2: Guest Selection */}
      {step === "guests" && date && (
        <GuestSelector
          guests={guests}
          onGuestsChange={setGuests}
          selectedDate={date}
          onContinue={handleShowTours}
          hasSelectedOver6={hasSelectedOver6}
          onHasSelectedOver6Change={setHasSelectedOver6}
        />
      )}

      {/* Step 3: Tour Selection */}
      {step === "tours" && date && (
        <div className="space-y-4">
          {/* Desktop Only: Summary Cards */}
          <div className="hidden lg:flex flex-col gap-3">
            {/* Date Summary Card */}
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {format(date, "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("date")}
                className="text-primary hover:text-primary/80"
              >
                Edit
              </Button>
            </div>

            {/* Guests Summary Card */}
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {guests} {guests === 1 ? "guest" : "guests"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("guests")}
                className="text-primary hover:text-primary/80"
              >
                Edit
              </Button>
            </div>
          </div>

          {/* Tour Time Cards - Always visible */}
          <TourTimeCards
            tours={availableTours}
            isLoading={isLoadingTours}
            onSelectTour={handleTourSelect}
            selectedGuests={guests}
          />
        </div>
      )}

      {/* Trust Elements - Always Visible */}
      <div className="space-y-1.5 pt-4 border-t">
        {[
          "Free cancellation anytime",
          "No upfront payment required",
          "Licensed & verified guides",
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-3 w-3 text-primary" />
            </div>
            <span className="text-muted-foreground">{item}</span>
          </div>
        ))}
      </div>

      {/* Urgency Badge */}
      {availableTours.length > 0 && step === "tours" && (
        <div className="bg-primary/10 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-primary">
            🔥 Limited spots available
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingSidebar;