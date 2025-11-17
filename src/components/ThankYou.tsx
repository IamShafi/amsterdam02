'use client';

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin, Clock, Mail, MessageCircle, Loader2, Copy } from "lucide-react";
import { getBookingDetails } from "@/lib/api/bookingService";
import { formatDateForDisplay, convertTo12Hour } from "@/lib/utils/dateTimeHelpers";
import type { BookingDetails } from "@/types/booking";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Skeleton } from "@/components/ui/skeleton";

const ThankYou = () => {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const bookingId = searchParams.get('bookingId') || localStorage.getItem('lastBookingId') || '';

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Exclude from search engine indexing
  useEffect(() => {
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'noindex, nofollow';
    document.head.appendChild(metaRobots);

    return () => {
      document.head.removeChild(metaRobots);
    };
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }

      try {
        const bookingData = await getBookingDetails(bookingId);
        setBooking(bookingData);
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        toast.error('Could not load booking details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  // Fire Google Ads conversion event when page loads
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', {'send_to': 'AW-17701055847/FX-2CJCXm7kbEOfawvhB'});
      console.log('Google Ads conversion event fired');
    }
  }, []);

  // Trigger confetti animation on page load
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2
        },
        colors: ['#ff6b35', '#f7931e', '#fdc500', '#4ecdc4', '#44cfcb']
      });
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2
        },
        colors: ['#ff6b35', '#f7931e', '#fdc500', '#4ecdc4', '#44cfcb']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleCopyBookingId = () => {
    if (bookingId) {
      navigator.clipboard.writeText(bookingId);
      toast.success('Booking ID copied to clipboard');
    }
  };

  const handleWhatsApp = () => {
    const message = booking
      ? `Hi! I have a booking (${bookingId}) for ${formatDateForDisplay(new Date(booking.tour_date))} at ${convertTo12Hour(booking.tour_time)}. I need help with...`
      : `Hi! I have a booking (${bookingId}). I need help with...`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const recommendations = [
    {
      title: "Canal Cruise Experience",
      image: "/placeholder.svg",
      description: "Complete your Amsterdam experience with a scenic canal tour",
      price: "€18",
      link: "/tours/2"
    },
    {
      title: "Dutch Food Tour",
      image: "/placeholder.svg",
      description: "Discover authentic Dutch cuisine and local favorites",
      price: "€45",
      link: "/tours/3"
    },
    {
      title: "Bike Tour Amsterdam",
      image: "/placeholder.svg",
      description: "Explore the city like a local on two wheels",
      price: "€35",
      link: "/tours/4"
    }
  ];

  return (
    <div className="min-h-[100dvh] min-h-[calc(var(--vh,1vh)*100)] bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Confirmation Section */}
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            Your Tour is Confirmed!
          </h1>
          
          {isLoading ? (
            <>
              <Skeleton className="h-7 w-80 mx-auto mb-4" />
              
              <div className="bg-card border-2 border-primary/20 rounded-lg p-6 max-w-md mx-auto mb-4">
                <div className="space-y-3">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-64" />
                  </div>
                  <div className="border-t pt-3">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 max-w-md mx-auto mb-6">
                <Skeleton className="h-4 w-64 mx-auto" />
              </div>
            </>
          ) : (
            <>
              {booking && (
                <>
                  <p className="text-xl text-muted-foreground mb-4">
                    We can't wait to meet you, {booking.customer_name.split(' ')[0]}!
                  </p>
                  
                  <div className="bg-card border-2 border-primary/20 rounded-lg p-6 max-w-md mx-auto mb-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                        <p className="text-lg font-semibold">
                          {formatDateForDisplay(new Date(booking.tour_date))} at {convertTo12Hour(booking.tour_time)}
                        </p>
                      </div>
                      <div className="border-t pt-3">
                        <p className="text-sm text-muted-foreground mb-1">Number of Guests</p>
                        <p className="text-lg font-semibold">
                          {booking.num_people} {booking.num_people === 1 ? 'guest' : 'guests'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card border rounded-lg p-4 max-w-md mx-auto mb-6">
                    <p className="text-sm text-muted-foreground text-center">
                      Made a mistake? <Link href={`/view-booking/${bookingId}`} className="text-primary hover:underline font-medium">Modify your booking here</Link>
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          {/* Meeting Details */}
          <div className="bg-secondary border rounded-lg p-6 text-left space-y-4">
            <h2 className="text-xl font-semibold mb-4">Important Information</h2>
            
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Meeting Point</p>
                <p className="text-sm text-muted-foreground">
                  Saint Nicholas Basilica (Prins Hendrikkade 73, 1012 AD Amsterdam)
                </p>
                <p className="text-sm text-muted-foreground">
                  Near Amsterdam Central Station - look for guides with orange umbrellas
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Arrival Time</p>
                <p className="text-sm text-muted-foreground">
                  Please arrive 10 minutes before your tour start time
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Confirmation Sent</p>
                <p className="text-sm text-muted-foreground">
                  Check your email for your booking reference and tour details
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Embed */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-4">Find Us Here</h2>
          <div className="bg-muted rounded-lg overflow-hidden h-[400px] border">
            <iframe
              src="https://maps.google.com/maps?q=52.376579,4.900516&hl=en&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Meeting Point - Saint Nicholas Basilica, Amsterdam"
            />
          </div>
        </div>

        {/* Final Message */}
        <div className="max-w-3xl mx-auto text-center mt-16 py-12 border-t">
          <p className="text-2xl font-semibold mb-2">
            See you soon — The Masterdam Tours Team 🇳🇱
          </p>
          <p className="text-muted-foreground">
            Can't wait to show you the real Amsterdam!
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ThankYou;
