import dynamic from "next/dynamic";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";
import FAQ from "@/components/TourDetails/FAQ";
import MapSection from "@/components/TourDetails/MapSection";
import MobileBookingBar from "@/components/TourDetails/MobileBookingBar";
import RatingTitle from "@/components/TourDetails/RatingTitle";
import TourCost from "@/components/TourDetails/TourCost";
const YourExperience = dynamic(() => import("../../components/TourDetails/YourExperience"));

// import TourDetails from "@/components/TourDetails";
import { faqs } from "@/lib/mockdata";

const TourDetailsPage = () => {
  return (
    <div className="min-h-[100svh] min-h-[calc(var(--vh,1vh)*100)] bg-background pb-24 lg:pb-0">
      <Header />
      {/* Hero Carousel */}
      <div className="overflow-hidden">
        {/* use default images */}
        {/* <ImageCarousel /> */}
      </div>
      {/* Below the fold */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl bg-background rounded-t-2xl relative z-10 -mt-[15px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10 md:space-y-12">
            {/* Title & Rating */}
            <RatingTitle />
            {/* What You'll Explore */}

            {/* How Much Does This Tour Cost */}
            <TourCost />
            {/* Happy Travelers Carousel */}
            
            {/* Your Experience Includes */}
            <YourExperience />

            {/* Testimonials */}

            {/* Tour Itinerary */}

            {/* FAQ */}
            {/* <FAQ faqs={faqs} /> */}

            {/* Map Section */}
            {/* <MapSection /> */}
          </div>
        </div>
      </div>

      {/* Mobile Booking Bar */}
      {/* <MobileBookingBar /> */}

      {/* <TourDetails /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default TourDetailsPage;
