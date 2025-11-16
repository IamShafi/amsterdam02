import React from "react";
import { Skeleton } from "../ui/skeleton";
import TestimonialCard from "./TestimonialCard";
type Testimonial = {
  name: string;
  location: string;
  review: string;
  rating: number;
  // add other fields if exist
};

type TestimonialsProps = {
  testimonials?: Testimonial[];
  testimonialsLoading: boolean;
  visibleReviews: number;
  setVisibleReviews: React.Dispatch<React.SetStateAction<number>>;
};

const Testimonials = ({
  testimonials,
  testimonialsLoading,
  visibleReviews,
  setVisibleReviews,
}: TestimonialsProps) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">What Our Guests Say</h2>
        <div className="text-sm md:text-base text-muted-foreground">
          {testimonialsLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : testimonials ? (
            `Showing ${visibleReviews} of 3,409 reviews`
          ) : null}
        </div>
      </div>
      {testimonialsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-20 w-full mb-2" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      ) : testimonials ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {testimonials
              .filter((t) => t.location && t.location.trim() !== "")
              .slice(0, visibleReviews)
              .map((testimonial, index) => (
                <TestimonialCard comment={""} date={""} key={index} {...testimonial} />
              ))}
          </div>
          {visibleReviews <
            testimonials.filter((t) => t.location && t.location.trim() !== "")
              .length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() =>
                  setVisibleReviews((prev) =>
                    Math.min(prev + 4, testimonials.length)
                  )
                }
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 decoration-dotted"
              >
                Show more reviews
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Testimonials;
