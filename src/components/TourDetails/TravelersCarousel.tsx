"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Skeleton } from "../ui/skeleton";

type ImageType = {
  id: string;
  image_url: string;
  alt_text: string;
};

type TravelersCarouselProps = {
  groupImages?: ImageType[];
  groupImagesLoading: boolean;
};

const TravelersCarousel = ({
  groupImages,
  groupImagesLoading,
}: TravelersCarouselProps) => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        21,000+ Happy Travelers
      </h2>
      <div className="overflow-hidden">
        <Carousel
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {groupImagesLoading ? (
              <div className="flex justify-center w-full py-8">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              groupImages?.map((image, index) => {
                return (
                  <CarouselItem
                    key={image.id}
                    className="pl-2 md:pl-3 basis-[92%] md:basis-[70%] lg:basis-[65%]"
                  >
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.alt_text}
                        className="w-full h-auto object-contain"
                        width={520}
                        height={390}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  </CarouselItem>
                );
              })
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default TravelersCarousel;
