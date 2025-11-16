import { Button } from "@/components/ui/button";
import { Users, Check } from "lucide-react";
import { format } from "date-fns";

interface GuestSelectorProps {
  guests: number;
  onGuestsChange: (guests: number) => void;
  selectedDate: Date;
  onContinue: () => void;
  hasSelectedOver6: boolean;
  onHasSelectedOver6Change: (value: boolean) => void;
}

export function GuestSelector({
  guests,
  onGuestsChange,
  selectedDate,
  onContinue,
  hasSelectedOver6,
  onHasSelectedOver6Change,
}: GuestSelectorProps) {
  const handleIncrement = () => {
    const newCount = Math.min(20, guests + 1);
    if (newCount > 6 && !hasSelectedOver6) {
      onHasSelectedOver6Change(true);
    }
    onGuestsChange(newCount);
  };
  return (
    <div className="space-y-4">
      {/* Selected Date Display */}
      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <Check className="h-5 w-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-sm font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-xs text-primary hover:underline"
          >
            Change date
          </button>
        </div>
      </div>

      {/* Guest Counter */}
      <div>
        <label className="text-sm font-medium mb-3 block">Number of Guests</label>
        <div className="flex items-center justify-between p-4 border-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-medium text-lg">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => onGuestsChange(Math.max(1, guests - 1))}
              disabled={guests <= 1}
            >
              −
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={handleIncrement}
              disabled={guests >= 20}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* Warning Note - when user had selected over 6 but reduced back */}
      {hasSelectedOver6 && guests <= 6 && (
        <div className="p-3 bg-muted/50 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> This tour is for groups up to 6. Bigger groups will be turned away at the meeting spot. For bigger groups we recommend booking a private tour for a more enjoyable experience.
          </p>
        </div>
      )}

      {/* Private Tour Message - when guests exceed 6 */}
      {guests > 6 && (
        <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-sm font-medium">
            <strong>Large group?</strong> For groups bigger than 6 we offer private tours. You can request a private tour by filling in your details below and one of our guides will contact you.
          </p>
        </div>
      )}

      {/* Continue Button */}
      <Button
        type="button"
        size="lg"
        className="w-full h-12 text-base font-semibold"
        onClick={onContinue}
      >
        {guests > 6 ? 'Request Private Tour' : 'Show Available Tours'}
      </Button>
    </div>
  );
}
