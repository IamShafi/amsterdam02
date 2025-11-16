"use client";
import React from "react";
import { LazySection } from "@/components/LazySection";

const Explore = () => {
  return (
    <LazySection>
      <div className="!mt-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          What You'll Explore
        </h2>
        <ul className="space-y-4">
          {/* {highlights.map((highlight, index) => {
                    const IconComponent = highlight.icon;
                    return (
                      <li key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-foreground leading-relaxed">{highlight.text}</span>
                      </li>
                    );
                  })} */}
        </ul>
      </div>
    </LazySection>
  );
};

export default Explore;
