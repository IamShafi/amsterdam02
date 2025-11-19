"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialCard from "../components/TourDetails/TestimonialCard";
import HowItWorksStep from "../components/HowItWorksStep";
import { FeaturedTourCard } from "../components/FeaturedTourCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@/types/testimonial";
import { mockTestimonials } from "@/lib/mockdata";

import { Users, Award, Calendar, Heart, CheckCircle } from "lucide-react";

const Home = () => {
  const isMobile = useIsMobile();
  const [visibleReviews, setVisibleReviews] = useState(isMobile ? 4 : 9);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      // const response = await fetch('/data/testimonials.json');
      // if (!response.ok) throw new Error('Failed to load testimonials');
      // return response.json();
      // simulate small latency like server fetch
      return new Promise<Testimonial[]>((resolve) =>
        setTimeout(() => resolve(mockTestimonials), 400)
      );
    },
    staleTime: Infinity,
  });

  return (
    <div className="min-h-[100dvh] bg-background w-full max-w-[100vw] overflow-x-clip relative">
      <Header isHomepage={true} />

      {/* Hero Section */}
      <section className="relative pt-8 pb-6 md:pt-12 md:pb-10 overflow-x-clip bg-[hsl(30,89%,93%)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text Content - Shows first on mobile */}
            <div className="text-left lg:text-left animate-fade-in order-1">
              {/* Big Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold mb-5 md:mb-6 leading-[1.1]">
                Amsterdam's #1 Best Rated Walking Tour
              </h1>

              {/* Subheadline with social proof */}
              <p className="text-base sm:text-lg md:text-xl text-foreground font-semibold mb-3">
                Rated 4.92★ by 3,409 travelers
              </p>

              <p className="text-base sm:text-lg md:text-xl text-black mb-6 sm:mb-8 leading-relaxed">
                Hidden gems, local secrets & fascinating history · Pay what you
                think it's worth
              </p>

              {/* Primary CTA - Large & Prominent */}
              <div className="w-full max-w-md">
                <Button
                  asChild
                  size="lg"
                  className="text-xl sm:text-xl md:text-2xl px-9 sm:px-10 md:px-12 h-16 sm:h-16 md:h-18 font-bold shadow-xl hover:shadow-2xl active:scale-[0.98] w-full"
                >
                  <Link href="/free-walking-tour-amsterdam">
                    RESERVE YOUR SPOTS →
                  </Link>
                </Button>

                {/* Trust text below CTA */}
                <p className="text-base sm:text-base text-muted-foreground/90 mt-3 sm:mt-4 flex flex-row items-center justify-center gap-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />
                    Free Booking
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-500" />
                    Free cancellation
                  </span>
                </p>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="order-2">
              {/* Desktop hero image */}
              <div className="hidden md:block relative">
                <Image
                  src="/assets/hero-grid.webp" // use WebP for smaller size
                  alt="Amsterdam walking tour experiences - group photos at iconic locations"
                  className="w-full h-auto object-contain rounded-xl"
                  width={662} // match displayed width
                  height={441} // match displayed height
                  priority={true} // ensures it's not lazy-loaded
                  quality={75} // reduces file size without noticeable loss
                  placeholder="blur" // optional: shows blurry placeholder while loading
                  blurDataURL="/assets/hero-grid-blur.png" // small blurred version
                />
              </div>

              {/* Mobile hero image */}
              <div className="block md:hidden relative w-full max-w-[501px]">
                <Image
                  src="/assets/hero-grid.webp"
                  alt="Amsterdam walking tour experiences - group photos at iconic locations"
                  className="w-full h-auto object-contain rounded-xl"
                  width={501}
                  height={498}
                  priority={true}
                  quality={75}
                  placeholder="blur"
                  blurDataURL="/assets/hero-grid-blur.png"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 px-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
            <HowItWorksStep
              icon={Calendar}
              step={1}
              title="Book"
              description="Reserve your spot in seconds - no payment required"
            />
            <HowItWorksStep
              icon={Users}
              step={2}
              title="Enjoy"
              description="Experience Amsterdam with local expert guides"
            />
            <HowItWorksStep
              icon={Heart}
              step={3}
              title="Tip"
              description="Pay what you think it's worth at the end"
            />
          </div>
        </div>
      </section>

      {/* Featured Tour Card Section */}
      <section className="py-8 md:py-12 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <FeaturedTourCard />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 relative">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 px-4">
            What Travelers Say
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: isMobile ? 4 : 9 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {testimonials
                  .filter((t) => t.location && t.location.trim() !== "")
                  .slice(0, visibleReviews)
                  .map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} />
                  ))}
              </div>

              {visibleReviews <
                testimonials.filter(
                  (t) => t.location && t.location.trim() !== ""
                ).length && (
                <div className="text-center mt-8">
                  <Button
                    onClick={() =>
                      setVisibleReviews((prev) => prev + (isMobile ? 4 : 6))
                    }
                    variant="outline"
                    size="lg"
                  >
                    Load More Reviews
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 px-4">
            Why Travelers Trust Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Local Guides
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Experienced guides sharing authentic stories
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Free Booking
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Reserve your spot with no upfront payment
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Best Price Guarantee
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Pay what you think it's worth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 px-4">
            Ready to Explore Amsterdam?
          </h2>
          <p className="text-xl sm:text-2xl mb-8 text-white/90 px-4">
            Join 21.000+ happy travelers on our free walking tour
          </p>
          <Button
            asChild
            variant="secondary"
            className="text-lg sm:text-xl md:text-2xl px-8 sm:px-10 md:px-12 py-4 md:py-5 w-full sm:w-auto max-w-xs min-h-[56px] md:min-h-[64px] font-semibold"
          >
            <Link href="/free-walking-tour-amsterdam">Book Your Free Spot</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
