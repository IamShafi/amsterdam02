import { Button } from "@/components/ui/button";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { Skeleton } from "@/components/ui/skeleton";

interface DateSelectorProps {
  date?: Date;
  firstButtonLabel: string;
  secondButtonLabel: string;
  onFirstButtonClick: () => void;
  onSecondButtonClick: () => void;
  onDateSelect: (date: Date) => void;
  isLoading?: boolean;
}

export function DateSelector({
  date,
  firstButtonLabel,
  secondButtonLabel,
  onFirstButtonClick,
  onSecondButtonClick,
  onDateSelect,
  isLoading = false,
}: DateSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium block">Select Date</label>
      
      {isLoading ? (
        <>
          {/* Skeleton for quick date buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          
          {/* Skeleton for calendar */}
          <div className="mt-4">
            <Skeleton className="h-[320px] w-full rounded-md" />
          </div>
        </>
      ) : (
        <>
          {/* Quick Date Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onFirstButtonClick}
              className="h-12 font-semibold"
            >
              {firstButtonLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSecondButtonClick}
              className="h-12 font-semibold"
            >
              {secondButtonLabel}
            </Button>
          </div>

          {/* Calendar */}
          <div className="mt-4">
            <CustomCalendar
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  onDateSelect(selectedDate);
                }
              }}
              disabled={(date) => date < new Date()}
            />
          </div>
        </>
      )}
    </div>
  );
}
