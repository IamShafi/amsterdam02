'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { getBookingDetails, cancelBooking } from "@/lib/api/bookingService";
import { formatDateForDisplay, convertTo12Hour } from "@/lib/utils/dateTimeHelpers";
import { handleBookingError } from "@/lib/api/errorHandler";
import type { BookingDetails } from "@/types/booking";

const CancelBooking = () => {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelled, setIsCancelled] = useState(false);

  const router = useRouter();
  const { bookingId } = useParams<{ bookingId: string }>();

  // Auto-load booking from URL parameter
  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) {
        toast({
          title: "Invalid Booking ID",
          description: "Please provide a valid booking ID.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const bookingData = await getBookingDetails(bookingId.trim());
        
        // Check if already cancelled
        if (bookingData.status === 'cancelled') {
          setIsCancelled(true);
        }
        
        setBooking(bookingData);
      } catch (error) {
        const handledError = handleBookingError(error);
        toast({
          title: "Error Loading Booking",
          description: handledError.userMessage,
          variant: "destructive",
        });
        setBooking(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!bookingId || !booking) return;

    setIsCancelling(true);

    try {
      await cancelBooking(bookingId, cancellationReason || undefined);
      setIsCancelled(true);
      setBooking({ ...booking, status: 'cancelled' });
    } catch (error) {
      const handledError = handleBookingError(error);
      toast({
        title: "Cancellation Failed",
        description: handledError.userMessage,
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleViewBooking = () => {
    router.push(`/view-booking/${bookingId}`);
  };

  const renderSkeletonLoader = () => (
    <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-48 flex-1" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          <Skeleton className="h-[54px] md:h-[48px] flex-1" />
          <Skeleton className="h-[54px] md:h-[48px] flex-1" />
        </div>
      </div>
    </Card>
  );

  const renderSuccessConfirmation = () => (
    <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleViewBooking}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold flex-1">Cancel booking</h2>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-6 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <p className="text-lg font-semibold text-green-700">
                Booking cancelled successfully
              </p>
              <p className="text-sm text-muted-foreground">
                Your booking for {booking && formatDateForDisplay(new Date(booking.tour_date))} at {booking && convertTo12Hour(booking.tour_time)} has been cancelled.
              </p>
              {cancellationReason && (
                <div className="pt-2 border-t border-green-500/20 mt-3">
                  <p className="text-sm font-medium text-muted-foreground">Cancellation reason:</p>
                  <p className="text-sm text-muted-foreground mt-1">{cancellationReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          className="w-full min-h-[54px] md:min-h-[48px] text-xl md:text-base font-semibold rounded-xl leading-none px-4 md:px-4"
          onClick={handleViewBooking}
        >
          View Booking Details
        </Button>
      </div>
    </Card>
  );

  const renderCancelForm = () => {
    if (!booking) return null;

    // Show message if already cancelled
    if (booking.status === 'cancelled' && !isCancelled) {
      return (
        <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
          <div className="flex items-center gap-3 pb-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewBooking}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-bold flex-1">Cancel booking</h2>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 space-y-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-destructive">
                    This booking has already been cancelled
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This booking was cancelled previously.
                  </p>
                </div>
              </div>
            </div>

            <Button
              className="w-full min-h-[54px] md:min-h-[48px] text-xl md:text-base font-semibold rounded-xl leading-none px-4 md:px-4"
              onClick={handleViewBooking}
            >
              View Booking Details
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 pb-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleViewBooking}
            disabled={isCancelling}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold flex-1">Cancel booking</h2>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 space-y-2">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-destructive">
                  You are about to cancel your booking for {formatDateForDisplay(new Date(booking.tour_date))} at {convertTo12Hour(booking.tour_time)}.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-base">
              Cancellation reason (optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Let us know why you're canceling (optional)"
              rows={4}
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              disabled={isCancelling}
              className="resize-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-2">
            <Button
              variant="outline"
              className="flex-1 w-full min-h-[54px] md:min-h-[48px] text-xl md:text-base font-semibold rounded-xl leading-none px-4 md:px-4"
              onClick={handleViewBooking}
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              className="flex-1 w-full min-h-[54px] md:min-h-[48px] text-xl md:text-base font-semibold rounded-xl leading-none px-4 md:px-4"
              onClick={handleCancelBooking}
              disabled={isCancelling}
            >
              {isCancelling ? <Loader2 className="h-7 w-7 md:h-5 md:w-5 animate-spin" /> : "Cancel Booking"}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          renderSkeletonLoader()
        ) : isCancelled ? (
          renderSuccessConfirmation()
        ) : (
          renderCancelForm()
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CancelBooking;
