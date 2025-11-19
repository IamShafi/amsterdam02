import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";
import MobileBookingBar from "@/components/TourDetails/MobileBookingBar";
import RatingTitle from "@/components/TourDetails/RatingTitle";
import TourCost from "@/components/TourDetails/TourCost";

// import TourDetails from "@/components/TourDetails";
import { faqs } from "@/lib/mockdata";
import YourExperience from "@/components/TourDetails/YourExperience";
import FAQ from "@/components/TourDetails/FAQ";
import MapSection from "@/components/TourDetails/MapSection";
import Explore from "@/components/TourDetails/Explore";
import TravelersCarousel from "@/components/TourDetails/TravelersCarousel";
import TourItinerary from "@/components/TourDetails/TourItinerary";
import BookingSidebar from "@/components/TourDetails/BookingSidebar";
import Testimonials from "@/components/TourDetails/Testimonials";

const TourDetailsPage = () => {
  return (
    <div className="min-h-[100svh] min-h-[calc(var(--vh,1vh)*100)] bg-background pb-24 lg:pb-0">
      <Header />
      {/* Hero Carousel */}
      <div className="overflow-hidden">
        {/* use default images */}
        <ImageCarousel />
      </div>
      {/* Below the fold */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl bg-background rounded-t-2xl relative z-10 -mt-[15px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10 md:space-y-12">
            {/* Title & Rating */}
            <RatingTitle />
            {/* What You'll Explore */}
            <Explore />

            {/* How Much Does This Tour Cost */}
            <TourCost />
            {/* Happy Travelers Carousel */}
            <TravelersCarousel />
            {/* Your Experience Includes */}
            <YourExperience />

            {/* Testimonials */}
            <Testimonials />
            {/* Tour Itinerary */}
            <TourItinerary />
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

      {/* <TourDetails /> */}
      <Footer />
    </div>
  );
};

export default TourDetailsPage;
