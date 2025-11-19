"use client";
import dynamic from "next/dynamic";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "./Header";
import Footer from "./Footer";
import ImageCarousel from "./ImageCarousel";
import { Clock, Star, Check } from "lucide-react";
import { getImagesByCategory } from "@/lib/api/imageService";
import { highlights, itinerary, faqs, includes, mockTestimonials } from "@/lib/mockdata";
// import Explore from "./TourDetails/Explore";
import TourCost from "./TourDetails/TourCost";

// import YourExperience from "./TourDetails/YourExperience";
// import Testimonials from "./TourDetails/Testimonials";
// import TravelersCarousel from "./TourDetails/TravelersCarousel";
// import TourItinerary from "./TourDetails/TourItinerary";
// import FAQ from "./TourDetails/FAQ";
// import MapSection from "./TourDetails/MapSection";
// import BookingSidebar from "./TourDetails/BookingSidebar";
// import MobileBookingBar from "./TourDetails/MobileBookingBar";
import { Testimonial } from "@/types/testimonial";
import CalendarPreloader from "./TourDetails/CalendarPreloader";

// const TravelersCarousel = dynamic(() => import("./TourDetails/TravelersCarousel"));
const Explore = dynamic(() => import("./TourDetails/Explore"));
const Testimonials = dynamic(() => import("./TourDetails/Testimonials"));
const TourItinerary = dynamic(() => import("./TourDetails/TourItinerary"));
const FAQ = dynamic(() => import("./TourDetails/FAQ"));
const MapSection = dynamic(() => import("./TourDetails/MapSection"), { ssr: false });
const YourExperience = dynamic(() => import("./TourDetails/YourExperience"));
const BookingSidebar = dynamic(() => import("./TourDetails/BookingSidebar"), { ssr: false });
const MobileBookingBar = dynamic(() => import("./TourDetails/MobileBookingBar"), { ssr: false });
const TourDetails = () => {
  const [visibleReviews, setVisibleReviews] = useState(4);
  const [shouldPreloadCalendar, setShouldPreloadCalendar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch tour carousel images from database
  const { data: tourImages, isLoading: tourImagesLoading } = useQuery({
    queryKey: ["tour-images"],
    queryFn: () => getImagesByCategory("tour"),
  });

  // Fetch group images from database
  const { data: groupImages, isLoading: groupImagesLoading } = useQuery({
    queryKey: ["group-images"],
    queryFn: () => getImagesByCategory("group"),
  });

   // Fetch testimonials from JSON file
   const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["tour-testimonials"],
    queryFn: async () => {
      // const response = await fetch("/data/tour-testimonials.json");
      // if (!response.ok) throw new Error("Failed to fetch testimonials");
      // return response.json();

      return new Promise<Testimonial[]>((resolve) =>
        setTimeout(() => resolve(mockTestimonials), 400)
      );
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Preload calendar after page content has loaded
  useEffect(() => {
    console.log("GroupImages", groupImages, "tourImages", tourImages, 'testimonials', testimonials);

    if (!tourImagesLoading && !groupImagesLoading && !shouldPreloadCalendar) {
      const timer = setTimeout(() => {
        setShouldPreloadCalendar(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [tourImagesLoading, groupImagesLoading, shouldPreloadCalendar]);

  const carouselImages =
    tourImages?.map((img) => ({
      src: img.image_url,
      alt: img.alt_text,
    })) || [];

 

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
        {/* use default image */}
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
            {/* <TravelersCarousel
              groupImages={groupImages}
              groupImagesLoading={groupImagesLoading}
            /> */}

            {/* Your Experience Includes */}
            <YourExperience />

            {/* Testimonials */}
            <Testimonials
              testimonials={testimonials}
              testimonialsLoading={testimonialsLoading}
              visibleReviews={visibleReviews}
              setVisibleReviews={setVisibleReviews}
            />

            {/* Tour Itinerary */}
            

            {/* FAQ */}
            <FAQ faqs={faqs} />

            {/* Map Section */}
            <MapSection />
          </div>

          {/* Booking Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
            <BookingSidebar />
          </div>
        </div>
      </div>

      {/* Mobile Booking Bar */}
      <MobileBookingBar />

      {/* Calendar Preloader - loads calendar in background after page loads */}
      {shouldPreloadCalendar && <CalendarPreloader />}

      <Footer />
    </div>
  );
};

export default TourDetails;
