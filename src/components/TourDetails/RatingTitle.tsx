import React from "react";
import { Clock, Star, Check } from "lucide-react";
const RatingTitle = () => {
  return (
    <div className="space-y-2 md:space-y-4">
      <h1 className="text-3xl md:text-5xl font-bold leading-tight">
        Amsterdam Original: The
        <br className="hidden md:block" /> Best All-in-One Walking Tour
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-base md:text-base">
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-primary text-primary" />
          <span className="font-semibold">4.92</span>
          <span className="text-muted-foreground">(3,409 reviews)</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap md:flex-nowrap gap-2 pt-2 md:max-w-md">
        <div className="flex items-center justify-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap">
          <span>🇬🇧</span>
          <span>English Tour</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap">
          <Clock className="h-4 w-4" />
          <span>2.5 Hours</span>
        </div>
        <div className="hidden md:flex items-center justify-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap">
          <Check className="h-4 w-4" />
          <span>Free Booking</span>
        </div>
      </div>
    </div>
  );
};

export default RatingTitle;
