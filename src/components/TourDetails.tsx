import React from "react";
import Header from "./Header";
import ImageCarousel from "./ImageCarousel";
import {
  Clock,
  Star,
  MapPin,
  Globe,
  Check,
  Shield,
  Users,
  Cookie,
  Utensils,
  Lightbulb,
  BookOpen,
  Waves,
  Store,
  MessageCircle,
  UsersRound,
  Flag,
  Coins,
  CreditCard,
  Banknote,
} from "lucide-react";
import Explore from "./TourDetails/Explore";
import TourCost from "./TourDetails/TourCost";
import TravelersCarousel from "./TourDetails/TravelersCarousel";

const TourDetails = () => {
  return (
    <div className="min-h-[100svh] min-h-[calc(var(--vh,1vh)*100)] bg-background pb-24 lg:pb-0">
      <Header />
      {/* Hero Carousel */}
      <div className="overflow-hidden">
        {/* {tourImagesLoading ? (
          <Skeleton className="w-full h-[400px] md:h-[600px]" />
        ) : (
          <ImageCarousel images={carouselImages} />
        )} */}
        <ImageCarousel
        // images={carouselImages}
        />
      </div>

      {/* Below the fold */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl bg-background rounded-t-2xl relative z-10 -mt-[15px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10 md:space-y-12">
            {/* Title & Rating */}
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

            {/* What You'll Explore */}
            <Explore />

            {/* How Much Does This Tour Cost */}
            <TourCost />

            {/* Happy Travelers Carousel */}
            <TravelersCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
