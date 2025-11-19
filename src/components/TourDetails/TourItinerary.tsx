import React from "react";
import { MapPin, Flag } from "lucide-react";
import { itinerary } from "@/lib/mockdata";
interface ItineraryStop {
  number: number;
  title: string;
  description: string;
}

const TourItinerary = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          What you'll see on this tour
        </h2>
      </div>

      <div className="space-y-0">
        {itinerary.map((stop, index) => (
          <div key={index} className="flex gap-4 relative">
            {/* Timeline connector */}
            {index < itinerary.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />
            )}

            {/* Icon/Number */}
            <div className="flex-shrink-0 z-10">
              {stop.number === 0 ? (
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              ) : stop.number === 9 ? (
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <Flag className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">
                    {stop.number}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <h3 className="text-lg font-bold mb-2">{stop.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {stop.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourItinerary;
/**
 *
 */
