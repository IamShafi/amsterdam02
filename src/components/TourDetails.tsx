import React from "react";
import Header from "./Header";
import ImageCarousel from "./ImageCarousel";

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
    </div>
  );
};

export default TourDetails;
