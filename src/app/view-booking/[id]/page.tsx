'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search, Calendar, Clock, Users, Mail, Phone, User, ArrowLeft, AlertCircle, X, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { addDays } from "date-fns";
import { DateSelector } from "../../../components/DateSelector";
import { TourTimeCards } from "../../../components/TourTimeCards";
import { CountrySelector } from "../../../components/CountrySelector";
import { toast } from "@/hooks/use-toast";
import { getBookingDetails, updateBookingSchedule, updateBooking, cancelBooking, checkAvailability } from "@/lib/api/bookingService";
import { formatDateForDisplay, formatDateForAPI, convertTo12Hour, convertTo24Hour } from "@/lib/utils/dateTimeHelpers";
import { handleBookingError } from "@/lib/api/errorHandler";
import type { BookingDetails, AvailabilityResponse } from "@/types/booking";

type EditingField = null | 'reschedule' | 'name' | 'email' | 'phone' | 'cancel';
type RescheduleStep = 'date' | 'guests' | 'tours' | 'confirm' | 'success' | null;

const ViewBooking = () => {
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [editingField, setEditingField] = useState<EditingField>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Reschedule flow state
  const [rescheduleStep, setRescheduleStep] = useState<RescheduleStep>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedTourTitle, setSelectedTourTitle] = useState<string>("");
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [availableTours, setAvailableTours] = useState<AvailabilityResponse[]>([]);
  const [isLoadingTours, setIsLoadingTours] = useState(false);
  
  // Contact editor state
  const [editValue, setEditValue] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");

  const router = useRouter();
  const { bookingId: urlBookingId } = useParams<{ bookingId?: string }>();

  // Auto-load booking if URL parameter is provided
  useEffect(() => {
    const loadBookingFromUrl = async () => {
      if (urlBookingId) {
        setIsLoading(true);
        setHasSearched(true);
        setBookingId(urlBookingId);

        try {
          const bookingData = await getBookingDetails(urlBookingId.trim());
          setBooking(bookingData);
        } catch (error) {
          setBooking(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadBookingFromUrl();
  }, [urlBookingId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingId.trim()) {
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const bookingData = await getBookingDetails(bookingId.trim());
      setBooking(bookingData);
    } catch (error) {
      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (field: EditingField) => {
    if (!booking) return;
    
    setEditingField(field);
    
    if (field === 'reschedule') {
      setSelectedDate(new Date(booking.tour_date));
      setSelectedGuests(booking.num_people);
      setSelectedTime("");
      setSelectedTourTitle("");
      setRescheduleStep('date');
    } else if (field === 'name') {
      setEditValue(booking.customer_name);
    } else if (field === 'email') {
      setEditValue(booking.customer_email);
    } else if (field === 'phone') {
      setEditValue(booking.customer_phone || "");
      setEditCountry(booking.country || "");
    }
  };

  const cancelEditing = () => {
    setEditingField(null);
    setRescheduleStep(null);
    setEditValue("");
    setEditCountry("");
    setAvailableTours([]);
    setCancellationReason("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setSelectedTourTitle("");
  };

  const loadAvailability = async (date: string) => {
    setIsLoadingTours(true);
    try {
      const tours = await checkAvailability(date);
      setAvailableTours(tours);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load available tours"
      });
    } finally {
      setIsLoadingTours(false);
    }
  };

  const saveReschedule = async () => {
    if (!booking || !selectedDate || !selectedTime) return;
    
    const newDate = formatDateForAPI(selectedDate);
    
    // Check if anything actually changed
    if (newDate === booking.tour_date && 
        selectedTime === booking.tour_time && 
        selectedGuests === booking.num_people) {
      toast({
        title: "No changes",
        description: "The booking details are the same"
      });
      cancelEditing();
      return;
    }

    setIsSaving(true);
    try {
      await updateBookingSchedule(booking.website_booking_id, {
        tour_date: newDate,
        tour_time: selectedTime,
        num_people: selectedGuests
      });
      
      const updatedBooking = await getBookingDetails(booking.website_booking_id);
      setBooking(updatedBooking);
      
      // Transition to success step
      setRescheduleStep('success');
    } catch (error: any) {
      const handledError = handleBookingError(error);
      toast({
        variant: "destructive",
        title: "Failed to update booking",
        description: handledError.userMessage
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveContactInfo = async (field: 'name' | 'email' | 'phone') => {
    if (!booking || !editValue.trim()) return;
    
    setIsSaving(true);
    try {
      const updates: any = {};
      if (field === 'name') updates.customer_name = editValue.trim();
      if (field === 'email') updates.customer_email = editValue.trim();
      if (field === 'phone') {
        updates.customer_phone = editValue.trim();
        if (editCountry) updates.country = editCountry;
      }
      
      await updateBooking(booking.website_booking_id, updates);
      
      const updatedBooking = await getBookingDetails(booking.website_booking_id);
      setBooking(updatedBooking);
      
      toast({
        title: "Contact info updated",
        description: `Your ${field} has been successfully changed`
      });
      cancelEditing();
    } catch (error: any) {
      const handledError = handleBookingError(error);
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: handledError.userMessage
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelBooking = async (reason?: string) => {
    if (!booking) return;

    setIsSaving(true);
    try {
      await cancelBooking(booking.website_booking_id, reason || "Customer requested cancellation");
      
      const updatedBooking = await getBookingDetails(booking.website_booking_id);
      setBooking(updatedBooking);
      
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully"
      });
      cancelEditing();
    } catch (error: any) {
      const handledError = handleBookingError(error);
      toast({
        variant: "destructive",
        title: "Failed to cancel",
        description: handledError.userMessage
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderSkeletonLoader = () => (
    <Card className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3 pl-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-5 w-56" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  const renderRescheduleFlow = () => {
    if (!booking) return null;

    const handleDateSelect = (date: Date) => {
      setSelectedDate(date);
      setRescheduleStep('guests');
    };

    const handleGuestsConfirm = async () => {
      if (!selectedDate) return;
      setRescheduleStep('tours');
      await loadAvailability(formatDateForAPI(selectedDate));
    };

    const handleTourSelect = (tour: AvailabilityResponse) => {
      setSelectedTime(tour.tour_time);
      setSelectedTourTitle(tour.tour_title || "");
      setRescheduleStep('confirm');
    };

    const handleBack = () => {
      if (rescheduleStep === 'date') {
        cancelEditing();
      } else if (rescheduleStep === 'guests') {
        setRescheduleStep('date');
      } else if (rescheduleStep === 'tours') {
        setRescheduleStep('guests');
      } else if (rescheduleStep === 'confirm') {
        setRescheduleStep('tours');
      }
    };

    switch (rescheduleStep) {
      case 'date':
        return (
          <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 pb-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                disabled={isSaving}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold flex-1">Select a new date</h2>
            </div>

            <DateSelector
              date={selectedDate}
              firstButtonLabel="Today"
              secondButtonLabel="Tomorrow"
              onFirstButtonClick={() => handleDateSelect(new Date())}
              onSecondButtonClick={() => handleDateSelect(addDays(new Date(), 1))}
              onDateSelect={handleDateSelect}
              isLoading={false}
            />
          </Card>
        );

      case 'guests':
        return (
          <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 pb-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                disabled={isSaving}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold flex-1">How many guests?</h2>
            </div>

            <div className="space-y-4">
              {/* Selected Date Summary */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Selected Date</p>
                    <p className="font-medium">{selectedDate && formatDateForDisplay(selectedDate)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setRescheduleStep('date')}
                    className="text-primary hover:text-primary"
                  >
                    Change
                  </Button>
                </div>
              </div>

              {/* Guest Counter */}
              <div>
                <label className="text-sm font-medium mb-3 block">Number of Guests</label>
                <div className="flex items-center justify-between p-6 border-2 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-xl">{selectedGuests} {selectedGuests === 1 ? 'guest' : 'guests'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full text-lg"
                      onClick={() => setSelectedGuests(Math.max(1, selectedGuests - 1))}
                      disabled={selectedGuests <= 1 || isSaving}
                    >
                      −
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full text-lg"
                      onClick={() => setSelectedGuests(Math.min(6, selectedGuests + 1))}
                      disabled={selectedGuests >= 6 || isSaving}
                    >
                      +
                    </Button>
                  </div>
                </div>
                {selectedGuests === 6 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Maximum group size is 6 people per booking
                  </p>
                )}
              </div>

              <Button
                size="lg"
                className="w-full h-12 text-base font-semibold"
                onClick={handleGuestsConfirm}
                disabled={isSaving}
              >
                Show Available Times
              </Button>
            </div>
          </Card>
        );

      case 'tours':
        return (
          <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 pb-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                disabled={isSaving}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold flex-1">Select a new time</h2>
            </div>

            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium truncate">{selectedDate && formatDateForDisplay(selectedDate)}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="text-sm font-medium truncate">{selectedGuests} {selectedGuests === 1 ? 'guest' : 'guests'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <TourTimeCards
                tours={availableTours}
                isLoading={isLoadingTours}
                onSelectTour={handleTourSelect}
                selectedGuests={selectedGuests}
              />
            </div>
          </Card>
        );

      case 'confirm':
        return (
          <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 pb-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                disabled={isSaving}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold flex-1">Confirm changes</h2>
            </div>

            <div className="space-y-6">
              {/* New Booking Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">New Booking</h3>
                
                <div className="space-y-3">
                  {/* Date Card */}
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Date</div>
                        <div className="font-medium">{formatDateForDisplay(selectedDate!)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Time Card */}
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Time</div>
                        <div className="font-medium">{convertTo12Hour(selectedTime)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Guests Card */}
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Guests</div>
                        <div className="font-medium">{selectedGuests} guest(s)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 w-full min-h-[54px] md:min-h-[48px] text-xl md:text-base font-semibold rounded-xl leading-none px-4"
                  onClick={cancelEditing}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 w-full min-h-[54px] md:min-h-[48px] text-xl md:text-base font-semibold rounded-xl leading-none px-4"
                  onClick={saveReschedule}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-7 w-7 md:h-5 md:w-5 animate-spin" /> : "Confirm Rebooking"}
                </Button>
              </div>
            </div>
        </Card>
      );

    case 'success':
      return (
        <Card className="p-8 sm:p-12 space-y-8 max-w-2xl mx-auto text-center">
          <div className="space-y-6">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto" strokeWidth={1.5} />
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Confirmed!</h2>
              <p className="text-muted-foreground text-lg">
                Your booking has been successfully rescheduled
              </p>
            </div>
          </div>
          
          <Button
            size="lg"
            className="w-full max-w-sm mx-auto h-12 text-base font-semibold"
            onClick={cancelEditing}
          >
            View Booking
          </Button>
        </Card>
      );

    default:
      return null;
    }
  };

  const renderContactEditor = (field: 'name' | 'email' | 'phone') => (
    <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={cancelEditing}
          disabled={isSaving}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold flex-1">
          {field === 'name' && 'Update name'}
          {field === 'email' && 'Update email'}
          {field === 'phone' && 'Update phone number'}
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="edit-value" className="text-base mb-2 block">
            {field === 'name' && 'Full name'}
            {field === 'email' && 'Email address'}
            {field === 'phone' && 'Phone number'}
          </Label>
          {field === 'phone' ? (
            <div className="space-y-3">
              <CountrySelector
                value={editCountry}
                onChange={setEditCountry}
                disabled={isSaving}
              />
              <Input
                id="edit-value"
                type="tel"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="612345678"
                className="h-12 text-base"
                disabled={isSaving}
              />
            </div>
          ) : (
            <Input
              id="edit-value"
              type={field === 'email' ? 'email' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={field === 'name' ? 'John Doe' : 'john@example.com'}
              className="h-12 text-base"
              disabled={isSaving}
            />
          )}
        </div>

        <Button
          size="lg"
          className="w-full h-12 text-base font-semibold"
          onClick={() => saveContactInfo(field)}
          disabled={isSaving || !editValue.trim()}
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
        </Button>
      </div>
    </Card>
  );

  const renderCancelEditor = () => {
    if (!booking) return null;

    return (
      <Card className="p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-center gap-3 pb-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={cancelEditing}
            disabled={isSaving}
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
              disabled={isSaving}
              className="resize-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-2">
            <Button
              variant="outline"
              className="flex-1 w-full min-h-[54px] md:min-h-[48px] text-xl md:text-base font-semibold rounded-xl leading-none px-4 md:px-4"
              onClick={cancelEditing}
              disabled={isSaving}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              className="flex-1 w-full min-h-[54px] md:min-h-[48px] text-xl md:text-base font-semibold rounded-xl leading-none px-4 md:px-4"
              onClick={() => handleCancelBooking(cancellationReason)}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-7 w-7 md:h-5 md:w-5 animate-spin" /> : "Cancel Booking"}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const renderBookingDetails = () => (
    <Card className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3 pb-4 border-b">
        <h2 className="text-2xl sm:text-3xl font-bold">Booking Details</h2>
        <Badge 
          variant={booking!.status === 'scheduled' ? 'default' : 'destructive'}
          className="w-fit text-xs px-2 py-0.5"
        >
          {booking!.status === 'scheduled' ? 'Confirmed' : 'Cancelled'}
        </Badge>
      </div>

      {booking!.status === 'cancelled' && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-destructive">This booking has been cancelled</p>
            <p className="text-sm text-muted-foreground mt-1">You cannot modify a cancelled booking</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Tour Details</h3>
        <div className="space-y-3 pl-1">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium text-base truncate">
                {formatDateForDisplay(new Date(booking!.tour_date))}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium text-base truncate">{convertTo12Hour(booking!.tour_time)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Guests</p>
              <p className="font-medium text-base truncate">
                {booking!.num_people} {booking!.num_people === 1 ? 'guest' : 'guests'}
              </p>
            </div>
          </div>
        </div>

        {booking!.status === 'scheduled' && (
          <Button 
            variant="outline" 
            className="w-full h-12 text-base font-semibold mt-4 border-2 border-primary/30 text-[#f5631a] hover:bg-primary/10 hover:text-black"
            onClick={() => startEditing('reschedule')}
          >
            Reschedule Booking
          </Button>
        )}
      </div>

      <div className="border-t" />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
        <div className="space-y-3 pl-1">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium text-base truncate">{booking!.customer_name}</p>
            </div>
            {booking!.status === 'scheduled' && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex-shrink-0 h-8 px-4 text-primary border-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-full transition-all"
                onClick={() => startEditing('name')}
              >
                Change
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-base truncate">{booking!.customer_email}</p>
            </div>
            {booking!.status === 'scheduled' && (
              <Button 
                variant="outline" 
                size="sm"
                className="flex-shrink-0 h-8 px-4 text-primary border-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-full transition-all"
                onClick={() => startEditing('email')}
              >
                Change
              </Button>
            )}
          </div>

          {booking!.customer_phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-base truncate">{booking!.customer_phone}</p>
              </div>
              {booking!.status === 'scheduled' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-shrink-0 h-8 px-4 text-primary border-primary hover:bg-primary hover:text-primary-foreground font-medium rounded-full transition-all"
                  onClick={() => startEditing('phone')}
                >
                  Change
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {booking!.status === 'scheduled' && (
        <>
          <div className="border-t" />
          <div className="space-y-3 pt-2">
            <Button 
              variant="destructive" 
              className="w-full h-12 text-base font-medium"
              onClick={() => startEditing('cancel')}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Cancel Booking"}
            </Button>
          </div>
        </>
      )}
    </Card>
  );

  return (
    <div className="min-h-[100dvh] min-h-[calc(var(--vh,1vh)*100)] bg-background">
      <Header />

      <div className="container mx-auto px-4 pt-6 pb-12">
        <div className="max-w-2xl mx-auto">
          {!urlBookingId && !editingField && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-3">View My Booking</h1>
              <p className="text-lg text-muted-foreground">
                Enter your booking ID to view your tour details
              </p>
            </div>
          )}

          {!urlBookingId && !editingField && (
            <Card className="p-6 mb-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Label htmlFor="bookingId">Booking ID</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="bookingId"
                      placeholder="WEB-1234567890-ABC123"
                      value={bookingId}
                      onChange={(e) => setBookingId(e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your booking ID was sent to your email and shown on the confirmation page
                  </p>
                </div>
              </form>
            </Card>
          )}

          {urlBookingId && isLoading && renderSkeletonLoader()}

          {booking && editingField === null && renderBookingDetails()}
          {booking && editingField === 'reschedule' && renderRescheduleFlow()}
          {booking && editingField === 'name' && renderContactEditor('name')}
          {booking && editingField === 'email' && renderContactEditor('email')}
          {booking && editingField === 'phone' && renderContactEditor('phone')}
          {booking && editingField === 'cancel' && renderCancelEditor()}

          {!urlBookingId && !booking && hasSearched && !isLoading && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No booking found with that ID
              </p>
              <p className="text-sm text-muted-foreground">
                Please check your booking ID and try again, or check your email for the correct ID
              </p>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ViewBooking;