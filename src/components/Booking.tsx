'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Users, Check, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CountrySelector } from "./CountrySelector";
import { createBooking, checkBookingExists, getBookingByEmail, cancelBooking, updateBooking } from "@/lib/api/bookingService";
import { handleBookingError } from "@/lib/api/errorHandler";
import { convertTo12Hour, convertTo24Hour, formatDateForAPI } from "@/lib/utils/dateTimeHelpers";
import { COUNTRIES } from "@/lib/data/countries";
import type { BookingRequest } from "@/types/booking";

const Booking = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get data from URL parameters
  const tourDate = searchParams.get('date');
  const tourTime = searchParams.get('tourTime');
  const tourTitle = searchParams.get('tourTitle');
  const numGuests = searchParams.get('guests');
  const potentialBigGroup = searchParams.get('potentialBigGroup') === 'true';

  // Redirect if missing required params
  if (!tourDate || !tourTime || !tourTitle || !numGuests) {
    toast.error("Missing booking information");
    router.push('/free-walking-tour-amsterdam');
    return null;
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [showExistingBookingScreen, setShowExistingBookingScreen] = useState(false);
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    phone: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sanitizePhoneInput = (value: string): string => {
    return value.replace(/[^0-9]/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePhoneInput(e.target.value);
    setFormData(prev => ({ ...prev, phone: sanitized }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check for duplicate booking
      setIsCheckingDuplicate(true);
      const bookingExists = await checkBookingExists(formData.email);
      
      if (bookingExists) {
        // Get full booking details
        const existingBookingData = await getBookingByEmail(formData.email);
        
        if (existingBookingData) {
          setExistingBooking(existingBookingData);
          setIsCheckingDuplicate(false);
          setIsSubmitting(false);
          setShowExistingBookingScreen(true);
          return; // Exit early, don't create new booking
        }
      }
      setIsCheckingDuplicate(false);

      const selectedCountry = COUNTRIES.find(c => c.id === formData.country);
      const fullPhone = formData.phone && selectedCountry 
        ? `${selectedCountry.code}${formData.phone}`
        : "";

      const bookingData: BookingRequest = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: fullPhone,
        country: selectedCountry?.name || "",
        tour_date: tourDate,
        tour_time: tourTime,
        tour_title: tourTitle,
        num_people: parseInt(numGuests),
        potential_big_group: potentialBigGroup,
      };

      const response = await createBooking(bookingData);

      toast.success("Booking confirmed!");
      
      // Navigate to thank you page with booking ID
      router.push(`/thank-you?bookingId=${response.website_booking_id}`);
    } catch (error) {
      const handled = handleBookingError(error);
      toast.error(handled.userMessage);
      
      if (handled.type === 'FULLY_BOOKED' || handled.type === 'INSUFFICIENT_SPOTS') {
        setTimeout(() => {
           router.push('/free-walking-tour-amsterdam');
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
      setIsCheckingDuplicate(false);
    }
  };

  const handleRescheduleToNew = async () => {
    if (!existingBooking || !formData.name || !formData.email || !tourDate || !tourTime) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Step 1: Cancel the existing booking
      await cancelBooking(existingBooking.booking_code, 
        `Rescheduled to ${tourDate} at ${tourTime}`
      );

      // Step 2: Create new booking with selected details
      const selectedCountry = COUNTRIES.find(c => c.id === formData.country);
      const fullPhone = formData.phone && selectedCountry 
        ? `${selectedCountry.code}${formData.phone}`
        : existingBooking.customer_phone;

      const bookingData: BookingRequest = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: fullPhone || "",
        country: existingBooking.country || (selectedCountry?.name || ""),
        tour_date: tourDate,
        tour_time: tourTime,
        tour_title: tourTitle,
        num_people: parseInt(numGuests),
        potential_big_group: potentialBigGroup,
        notes: `Rescheduled from ${existingBooking.date} at ${existingBooking.time}`
      };

      const booking = await createBooking(bookingData);

      // If country was in old booking, update new booking with it
      if (existingBooking.country && booking.website_booking_id) {
        await updateBooking(booking.website_booking_id, {
          country: existingBooking.country
        });
      }

      toast.success("Booking rescheduled successfully!");
      
      // Navigate to thank you page
      router.push(`/thank-you?bookingId=${booking.website_booking_id}`);
    } catch (error) {
      const handled = handleBookingError(error);
      toast.error(handled.userMessage);
      
      if (handled.type === 'FULLY_BOOKED' || handled.type === 'INSUFFICIENT_SPOTS') {
        setTimeout(() => {
            router.push('/free-walking-tour-amsterdam');
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const dateObj = new Date(tourDate);
  const time12h = convertTo12Hour(tourTime);

  return (
    <div className="min-h-[100dvh] min-h-[calc(var(--vh,1vh)*100)] bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!showExistingBookingScreen ? (
            <>
              <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booking Form */}
                <div className="lg:col-span-2">
              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="mt-2 h-12"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="mt-2 h-12"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <div className="mt-2">
                      <CountrySelector
                        value={formData.country}
                        onChange={(value) => handleInputChange("country", value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number (optional)</Label>
                    <div className="mt-2 flex gap-2">
                      {formData.country && (
                        <div className="flex items-center px-3 h-12 border rounded-md bg-muted">
                          <span className="text-sm font-medium">
                            {COUNTRIES.find(c => c.id === formData.country)?.code}
                          </span>
                        </div>
                      )}
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={formData.country ? COUNTRIES.find(c => c.id === formData.country)?.placeholder : "Phone number"}
                        className="h-12 flex-1"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        disabled={isSubmitting || !formData.country}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-semibold mt-6"
                    disabled={isSubmitting || isCheckingDuplicate}
                  >
                    {isSubmitting || isCheckingDuplicate ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {isCheckingDuplicate ? "Checking..." : "Confirming..."}
                      </>
                    ) : (
                      "Confirm Free Reservation"
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-3">
                    No credit card required • Free cancellation anytime
                  </p>
                </form>
              </div>
            </div>

            {/* Tour Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-card border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg mb-4">Tour Summary</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{format(dateObj, "EEEE, MMMM d, yyyy")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{time12h}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Guests</p>
                      <p className="font-medium">{numGuests} {parseInt(numGuests) === 1 ? 'guest' : 'guests'}</p>
                    </div>
                  </div>

                  <div className="text-center py-3">
                    <Link 
                      href="/free-walking-tour-amsterdam"
                      className="text-xs hover:opacity-80 transition-opacity block"
                    >
                      <span className="text-muted-foreground">Made a mistake?</span>
                      <br />
                      <span className="text-primary">Modify your booking here</span>
                    </Link>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                    <p className="text-3xl font-bold text-primary">Free Booking</p>
                    <p className="text-xs text-muted-foreground mt-1">Tip-Based Tour</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  {[
                    "Free cancellation anytime",
                    "No upfront payment",
                    "Instant confirmation"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Point Map */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Meeting Point</h2>
            <div className="bg-muted rounded-xl overflow-hidden h-[400px] border">
              <iframe
                src="https://maps.google.com/maps?q=52.376579,4.900516&hl=en&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Meeting Point - Saint Nicholas Church, Amsterdam"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              📍 Saint Nicholas Church - Prins Hendrikkade 73, 1012 AD Amsterdam (Near Central Station)
            </p>
          </div>
            </>
          ) : (
            /* Existing Booking Screen */
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#f562181a' }}>
                  <Calendar className="h-8 w-8" style={{ color: '#f56218' }} />
                </div>
                <h1 className="text-3xl font-bold mb-2">You Already Have a Booking</h1>
                <p className="text-muted-foreground">We found an existing booking with this email address</p>
              </div>

              {/* Booking Cards Side by Side on Desktop */}
              {existingBooking && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Current Booking Details Card */}
                    <div className="bg-muted/50 border-2 border-muted rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-4">Current Booking Details</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                          <div className="text-base font-medium">
                            {format(new Date(existingBooking.date), 'EEEE, MMMM d, yyyy')}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                          <div className="text-base font-medium">{convertTo12Hour(existingBooking.time)}</div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-primary flex-shrink-0" />
                          <div className="text-base font-medium">
                            {existingBooking.persons} {existingBooking.persons === 1 ? 'Person' : 'People'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* New Booking Details Card */}
                    <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">NEW</span>
                        Requested Booking
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span className="font-medium">{format(dateObj, 'EEEE, MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-primary" />
                          <span className="font-medium">{time12h}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-primary" />
                          <span className="font-medium">{numGuests} {parseInt(numGuests) === 1 ? 'Guest' : 'Guests'}</span>
                        </div>
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Rescheduling...
                        </>
                      ) : (
                        <>
                          Reschedule to {format(dateObj, 'MMM d')} at {time12h}
                        </>
                      )}
                    </Button>

                    {/* View/Modify Existing Booking Button */}
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-14 text-base font-semibold"
                      onClick={() => {
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
                        setShowExistingBookingScreen(false);
                      }}
                    >
                      Go Back
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
