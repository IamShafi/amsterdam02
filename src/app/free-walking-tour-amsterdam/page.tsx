import Header from "@/components/Header";
import ImageCarousel from "@/components/ImageCarousel";
// import TourDetails from "@/components/TourDetails";


const TourDetailsPage = () => {
  return (
    <div className="min-h-[100svh] min-h-[calc(var(--vh,1vh)*100)] bg-background pb-24 lg:pb-0">
      <Header />
      {/* Hero Carousel */}
      <div className="overflow-hidden">
        {/* use default images */}
        <ImageCarousel />
      </div>
      {/* <TourDetails /> */}
    </div>
  );
};

export default TourDetailsPage;
