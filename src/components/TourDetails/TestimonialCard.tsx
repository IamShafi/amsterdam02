import { Star, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  verified?: boolean;
  tourName?: string; // Optional - won't display if not provided
}

const TestimonialCard = ({ 
  name, 
  location, 
  rating, 
  comment, 
  date,
  avatar,
  verified = true,
  tourName
}: TestimonialCardProps) => {
  return (
    <div className="bg-card border rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-3 sm:gap-4">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-foreground text-sm sm:text-base truncate">{name}</h4>
            {verified && (
              <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{location}</p>
        </div>
        <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-primary text-primary" />
          ))}
        </div>
      </div>

      {/* Tour Badge - Only show if provided */}
      {tourName && (
        <Badge variant="secondary" className="text-xs">
          {tourName}
        </Badge>
      )}

      {/* Comment */}
      <p className="text-sm sm:text-base text-foreground leading-relaxed">"{comment}"</p>

      {/* Date */}
      <p className="text-xs text-muted-foreground">{date}</p>
    </div>
  );
};

export default TestimonialCard;
