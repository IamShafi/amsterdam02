import { Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getImagesByCategory } from "@/lib/api/imageService";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedTourCard = () => {
  const { data: tourImages = [], isLoading } = useQuery({
    queryKey: ["tour-images"],
    queryFn: () => getImagesByCategory("tour"),
  });

  const featuredImage = tourImages[0];

  return (
    <Card className="max-w-2xl mx-auto overflow-hidden shadow-lg border border-border">
      {/* Hero Image */}
      <div className="relative">
        {isLoading ? (
          <Skeleton className="w-full h-48 sm:h-56 md:h-64" />
        ) : featuredImage ? (
          <img 
            src={featuredImage.image_url} 
            alt={featuredImage.alt_text} 
            className="w-full h-auto sm:h-56 md:h-64 object-cover"
            width="1184"
            height="789"
          />
        ) : (
          <div className="w-full h-48 sm:h-56 md:h-64 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
      </div>

      <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
          Amsterdam Original: The Best All-In-One Walking Tour
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 text-sm sm:text-base font-semibold">
            <Star className="inline h-4 w-4 fill-current mr-1" />
            4.92 · Excellent
          </Badge>
          <span className="text-sm text-muted-foreground">(3,409 reviews)</span>
        </div>

        {/* Tour Details */}
        <div className="space-y-1.5 sm:space-y-2 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="text-foreground">2 hours 30 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <span className="text-foreground">Starts at 10:00, 11:30 and 2 more</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button asChild className="w-full text-base sm:text-lg font-bold h-[3.4375rem] sm:h-[3.75rem]" size="lg">
          <Link href="/free-walking-tour-amsterdam">
            CHECK AVAILABILITY →
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
