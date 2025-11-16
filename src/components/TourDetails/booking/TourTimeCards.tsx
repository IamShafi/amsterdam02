import { Loader2, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { convertTo12Hour } from "@/lib/utils/dateTimeHelpers";
import type { AvailabilityResponse } from "@/types/booking";

interface TourTimeCardsProps {
  tours: AvailabilityResponse[];
  isLoading: boolean;
  onSelectTour: (tour: AvailabilityResponse) => void;
  selectedGuests: number;
}

export function TourTimeCards({
  tours,
  isLoading,
  onSelectTour,
  selectedGuests,
}: TourTimeCardsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tours available for this date.</p>
      </div>
    );
  }

  const availableTours = tours.filter(tour => 
    tour.is_available && tour.available_spots >= selectedGuests
  );

  if (availableTours.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No tours available for {selectedGuests} {selectedGuests === 1 ? 'guest' : 'guests'}.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Try selecting fewer guests or a different date.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Available Tours</h3>
      <div className="space-y-3">
        {availableTours.map((tour) => {
          const time12h = convertTo12Hour(tour.tour_time);
          const isLowAvailability = tour.available_spots <= 6;
          
          return (
            <button
              key={tour.tour_time}
              type="button"
              onClick={() => onSelectTour(tour)}
              className={cn(
                "w-full p-4 rounded-xl border-2 transition-all text-left",
                "hover:border-primary hover:bg-primary/5",
                "active:scale-[0.98]",
                "border-border bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg">{time12h}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">English • 2.5 Hours</span>
                  {isLowAvailability && (
                    <span className="text-xs text-[#fa6115] font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fa6115]"></span>
                      Only {tour.available_spots} spot{tour.available_spots === 1 ? '' : 's'} left
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
