import React from "react";
import { Cookie, Utensils, Lightbulb } from "lucide-react";

const YourExperience = () => {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Your Experience Includes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {[
          { text: "Complimentary Dutch snack", icon: Cookie },
          { text: "Local restaurant and bar recommendations", icon: Utensils },
          { text: "Insider tips for the rest of your stay", icon: Lightbulb },
        ].map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-2 border-primary/10 p-5 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconComponent className="h-5 w-5 text-primary" />
                </div>
                <span className="text-base font-medium leading-snug">
                  {item.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YourExperience;
