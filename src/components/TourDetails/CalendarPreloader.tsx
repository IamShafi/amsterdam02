import { CustomCalendar } from "@/components/ui/custom-calendar";

const CalendarPreloader = () => {
  return (
    <div style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none', left: '-9999px' }}>
      <CustomCalendar 
        selected={new Date()} 
        onSelect={() => {}} 
      />
    </div>
  );
};

export default CalendarPreloader;
