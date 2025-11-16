"use client";
import React from "react";
import { LazySection } from "@/components/LazySection";
import { Coins } from "lucide-react";
const TourCost = () => {
  return (
    <LazySection>
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Coins className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">Pay What You Want</h3>
            <p className="text-sm text-foreground leading-relaxed">
              This is a tip-based tour, free to book. After the tour, each
              person gives the guide the amount they feel is fair, depending on
              their budget and satisfaction with the experience.
            </p>
          </div>
        </div>
      </div>
    </LazySection>
  );
};

export default TourCost;
