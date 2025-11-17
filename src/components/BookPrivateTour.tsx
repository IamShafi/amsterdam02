'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Users, Check, Loader2, Mail, Phone, Globe, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { CountrySelector } from "./CountrySelector";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { formatDateForAPI, formatDateForDisplay } from "@/lib/utils/dateTimeHelpers";
import { COUNTRIES } from "@/lib/data/countries";

const BookPrivateTour = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateParam = searchParams.get('date');
  const hasPrefilledDate = dateParam !== null;
  const [date, setDate] = useState<Date | undefined>(() => {
    return dateParam ? new Date(dateParam) : undefined;
  });

  const [privateTourGuests, setPrivateTourGuests] = useState(() => {
    const guestsParam = searchParams.get('guests');
    if (guestsParam) {
      const numGuests = parseInt(guestsParam, 10);
      if (!isNaN(numGuests) && numGuests > 0 && numGuests <= 30) {
        return numGuests;
      }
    }
    return 4;
  });
  const [privateTourName, setPrivateTourName] = useState("");
  const [privateTourEmail, setPrivateTourEmail] = useState("");
  const [privateTourCountry, setPrivateTourCountry] = useState("");
  const [privateTourPhone, setPrivateTourPhone] = useState("");
  const [privateTourEmailError, setPrivateTourEmailError] = useState<string | null>(null);
  const [hasSelectedOver6, setHasSelectedOver6] = useState(() => {
    const guestsParam = searchParams.get('guests');
    if (guestsParam) {
      const numGuests = parseInt(guestsParam, 10);
      return numGuests > 6;
    }
    return false;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sanitizePhoneInput = (value: string): string => {
    return value.replace(/[^0-9]/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePhoneInput(e.target.value);
    setPrivateTourPhone(sanitized);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    const commonMistakes = ['gnail.com', 'gmai.com', 'gmial.com', 'yahooo.com', 'yaho.com', 'hotmial.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    if (commonMistakes.includes(domain)) {
      return false;
    }

    return true;
  };


  const calculatePrivateTourPrice = (guests: number): string => {
    if (guests <= 10) {
      const pricePerPerson = 249 / guests;
      return pricePerPerson.toFixed(2);
    }
    return "24.95";
  };

  const calculateTotalPrice = (guests: number): string => {
    if (guests <= 10) {
      return "249.00";
    }
    return (guests * 24.95).toFixed(2);
  };

  const handleGuestsChange = (delta: number) => {
    setPrivateTourGuests(prev => {
      const newValue = prev + delta;
      const clamped = Math.max(1, Math.min(30, newValue));

      if (clamped > 6 && !hasSelectedOver6) {
        setHasSelectedOver6(true);
      }

      return clamped;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Please select a preferred date");
      return;
    }

    if (!privateTourName || !privateTourEmail || !privateTourCountry || !privateTourPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!validateEmail(privateTourEmail)) {
      setPrivateTourEmailError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCountry = COUNTRIES.find(c => c.id === privateTourCountry);
      const fullPhone = `${selectedCountry?.code}${privateTourPhone}`;

      const requestBody = {
        customer_name: privateTourName,
        customer_email: privateTourEmail,
        customer_phone: fullPhone,
        country: selectedCountry?.name || "",
        number_of_guests: privateTourGuests,
        preferred_date: formatDateForAPI(date),
        potential_big_group: hasSelectedOver6 && privateTourGuests <= 6
      };

      const response = await fetch('https://ckgsdkifvijxxvjlhsaa.supabase.co/functions/v1/create-private-tour-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit private tour request');
      }

      const data = await response.json();
      
      setSubmittedData({
        name: privateTourName,
        email: privateTourEmail,
        phone: fullPhone,
        date: date,
        guests: privateTourGuests,
        pricePerPerson: calculatePrivateTourPrice(privateTourGuests)
      });
      
      setShowSuccess(true);
      toast.success("Private tour request submitted successfully!");
    } catch (error: any) {
      console.error('Error submitting private tour request:', error);
      toast.error(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess && submittedData) {
    return (
      <div className="min-h-[100dvh] min-h-[calc(var(--vh,1vh)*100)] bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Request Submitted!</h1>
              <p className="text-lg text-muted-foreground">
                We've received your private tour request and will contact you shortly to confirm the details.
              </p>
            </div>

            <div className="bg-card border rounded-xl p-8 space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Request Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{submittedData.name}</span>
                </div>
                
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{submittedData.email}</span>
                </div>
                
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{submittedData.phone}</span>
                </div>
                
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Preferred Date:</span>
                  <span className="font-medium text-right">{formatDateForDisplay(submittedData.date)}</span>
                </div>
                
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Guests:</span>
                  <span className="font-medium">{submittedData.guests} {submittedData.guests === 1 ? 'person' : 'people'}</span>
                </div>
                
                <div className="flex justify-between pt-3">
                  <span className="text-lg font-semibold">Price per Person:</span>
                  <span className="text-2xl font-bold text-primary">€{submittedData.pricePerPerson}</span>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mt-6">
                <p className="text-sm text-muted-foreground">
                  <strong>What's next?</strong> We'll review your request and reach out to you within 24 hours to confirm availability and finalize the booking details.
                </p>
              </div>

              <Button 
                size="lg" 
                className="w-full mt-6"
                onClick={() => router.push('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] min-h-[calc(var(--vh,1vh)*100)] bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">Book a Private Tour</h1>
            <p className="text-lg text-muted-foreground">
              Exclusive experience with your own personal guide
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Calendar Section - Show calendar or selected date card */}
              {!date ? (
                <div className="bg-card border rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Select Your Preferred Date
                  </h2>
                  <CustomCalendar
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date <= today;
                    }}
                  />
                </div>
              ) : (
                <div className="bg-card border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Selected Date</p>
                        <p className="text-lg font-semibold">{formatDateForDisplay(date)}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDate(undefined)}
                      className="text-primary hover:text-primary/80"
                    >
                      Change
                    </Button>
                  </div>
                </div>
              )}

              {/* Guest Selection */}
              <div className="bg-card border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Number of Guests</p>
                      <p className="text-lg font-semibold">
                        {privateTourGuests} {privateTourGuests === 1 ? 'person' : 'people'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => handleGuestsChange(-1)}
                      disabled={privateTourGuests <= 1}
                      className="h-10 w-10 rounded-full"
                    >
                      −
                    </Button>
                    
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => handleGuestsChange(1)}
                      disabled={privateTourGuests >= 30}
                      className="h-10 w-10 rounded-full"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {hasSelectedOver6 && privateTourGuests <= 6 && (
                  <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-200">
                      We noticed you selected more than 6 guests earlier. If you need a larger group, please increase the number.
                    </p>
                  </div>
                )}
              </div>

              {/* Contact Form */}
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
                      value={privateTourName}
                      onChange={(e) => setPrivateTourName(e.target.value)}
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
                      className={`mt-2 h-12 ${privateTourEmailError ? 'border-red-500' : ''}`}
                      value={privateTourEmail}
                      onChange={(e) => {
                        setPrivateTourEmail(e.target.value);
                        setPrivateTourEmailError(null);
                      }}
                      required
                      disabled={isSubmitting}
                    />
                    {privateTourEmailError && (
                      <p className="text-red-500 text-sm mt-1">{privateTourEmailError}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <div className="mt-2">
                      <CountrySelector
                        value={privateTourCountry}
                        onChange={(value) => {
                          setPrivateTourCountry(value);
                          setPrivateTourPhone("");
                        }}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="mt-2 flex gap-2">
                      {privateTourCountry && (
                        <div className="flex items-center px-3 h-12 border rounded-md bg-muted">
                          <span className="text-sm font-medium">
                            {COUNTRIES.find(c => c.id === privateTourCountry)?.code}
                          </span>
                        </div>
                      )}
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={privateTourCountry ? COUNTRIES.find(c => c.id === privateTourCountry)?.placeholder : "Phone number"}
                        className="h-12 flex-1"
                        value={privateTourPhone}
                        onChange={handlePhoneChange}
                        disabled={isSubmitting || !privateTourCountry}
                        required
                      />
                    </div>
                  </div>
                </form>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base font-semibold mt-6"
                  disabled={isSubmitting || !date}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Request Private Tour"
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  We'll contact you within 24 hours to confirm
                </p>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-card border rounded-xl p-6 space-y-6">
                <h3 className="font-semibold text-xl mb-4">Tour Summary</h3>

                <div className="space-y-4">
                  {date && (
                    <div className="flex items-start gap-3 pb-4 border-b">
                      <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Preferred Date</p>
                        <p className="font-medium text-sm">{formatDateForDisplay(date)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 pb-4 border-b">
                    <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Number of Guests</p>
                      <p className="font-medium">{privateTourGuests} {privateTourGuests === 1 ? 'person' : 'people'}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">Price per person</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">€{calculatePrivateTourPrice(privateTourGuests)}</span>
                        <span className="text-xs text-muted-foreground">incl. Tax</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 space-y-2 border border-primary/10">
                  <h4 className="font-semibold text-sm mb-3">What's Included</h4>
                  {[
                    "Private tour guide",
                    "Your group only",
                    "Free snack included",
                    "All taxes included",
                    "Flexible scheduling"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-2">How Private Tours Work</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li>1. Submit your request with preferred date</li>
                    <li>2. We'll confirm availability within 24 hours</li>
                    <li>3. Enjoy your exclusive private tour!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookPrivateTour;
