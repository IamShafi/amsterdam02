'use client';

import { MapPin, Copy, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import orangeUmbrella from "../../../public/assets/orange-umbrella.png";
import Image from "next/image";

const MapSection = () => {
  const address = "Saint Nicholas Basilica, Prins Hendrikkade 73, 1012 AD Amsterdam";
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Saint+Nicholas+Church+Amsterdam";

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Meeting Point</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden border">
          <iframe
            src="https://maps.google.com/maps?q=52.376579,4.900516&hl=en&z=16&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Meeting Point - Saint Nicholas Basilica, Amsterdam"
          />
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="bg-secondary p-6 rounded-xl space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">Saint Nicholas Basilica</h3>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="default"
              className="w-full h-12 sm:h-auto"
              onClick={copyAddress}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Address
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-20 h-20 flex-shrink-0 bg-muted rounded-lg flex items-center justify-center p-2">
              <Image src={orangeUmbrella} alt="Orange umbrella" className="w-full h-full object-contain" />
            </div>
            <p>Look for our guides with orange umbrellas - you can't miss us!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
