'use client';
import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Grid3x3, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// Import local images
import tour1 from "../../public/walking-tour/tour-1.jpg";
import tour2 from "../../public/walking-tour/tour-2.jpg";
import tour3 from "../../public/walking-tour/tour-3.jpg";
import tour4 from "../../public/walking-tour/tour-4.jpg";
import tour5 from "../../public/walking-tour/tour-5.jpg";

import Mobiletour1 from "../../public/walking-tour/tour-1.webp";
import Mobiletour2 from "../../public/walking-tour/tour-2.webp";
import Mobiletour3 from "../../public/walking-tour/tour-3.webp";
import Mobiletour4 from "../../public/walking-tour/tour-4.webp";
import Mobiletour5 from "../../public/walking-tour/tour-5.webp";
interface ImageCarouselProps {
  images?: {
    src: string;
    alt: string;
  }[];
  onShowAllClick?: () => void;
}

const ImageCarousel = ({ images, onShowAllClick }: ImageCarouselProps) => {
  // Use local images as default if no images prop provided
  const defaultImages = [
    { src: tour1, alt: "Walking tour location 1" },
    { src: tour2, alt: "Walking tour location 2" },
    { src: tour3, alt: "Walking tour location 3" },
    { src: tour4, alt: "Walking tour location 4" },
    { src: tour5, alt: "Walking tour location 5" },
  ];

  const displayImages = defaultImages;

  const [autoplayReady, setAutoplayReady] = useState(false);
  const autoplayPlugin = useRef(Autoplay({ delay: 10000, stopOnInteraction: true }));

  // Start WITHOUT autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 30,
    align: 'start'
  }, autoplayReady ? [autoplayPlugin.current] : []);

  useEffect(() => {
    // Wait for LCP, then enable autoplay
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        setAutoplayReady(true);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Fallback after 2.5s
    const timeout = setTimeout(() => setAutoplayReady(true), 2500);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="relative group">
      {/* Recommended Badge */}
      <div className="absolute top-4 left-0 z-20 bg-orange-500/80 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-r-md font-semibold text-base md:text-base flex items-center gap-2 shadow-lg backdrop-blur-sm">
        <Award className="h-5 w-5 md:h-5 md:w-5" />
        Recommended
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {displayImages.map((image, index) => {
            // Prioritize first 5 images to ensure LCP image gets proper priority
            const isPriorityImage = index < 5;
            const width = 400;
            const height = 300;

            return (
              <div
                key={index}
                className="flex-[0_0_85%] md:flex-[0_0_32%] min-w-0 pr-2 md:pr-3"
              >
                <div className="hidden md:block defaultImages relative h-[288px] md:h-[360px] rounded-lg overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    width={width}
                    height={height}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                {/* show for mobile */}
                <div className="md:hidden block MobiledefaultImages relative h-[288px] md:h-[360px] rounded-lg overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    width={width}
                    height={height}
                    fetchPriority={"high"}
                    loading={"eager"}
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show All Photos Button */}
      {onShowAllClick && (
        <Button
          variant="outline"
          className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-0"
          onClick={onShowAllClick}
        >
          <Grid3x3 className="h-4 w-4 mr-2" />
          Show all photos
        </Button>
      )}
    </div>
  );
};

export default ImageCarousel;
