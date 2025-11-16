import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HowItWorksStepProps {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
}

const HowItWorksStep = ({ icon: Icon, step, title, description }: HowItWorksStepProps) => {
  return (
    <Card className="relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
      <CardContent className="p-4 md:p-8 flex md:block items-start md:items-center text-left md:text-center">
        <div className="mb-0 md:mb-6 mr-3 md:mr-0 relative flex-shrink-0">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-xl md:rounded-2xl flex items-center justify-center md:mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <Icon className="h-8 w-8 md:h-12 md:w-12 text-primary" strokeWidth={2.5} />
          </div>
          <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-7 h-7 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-lg">
            {step}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-3 group-hover:text-primary transition-colors duration-300">{title}</h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HowItWorksStep;
