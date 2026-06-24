import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateYearOptions } from "@/utils/lunar-calculations";

interface LunarCalendarControlsProps {
  year: number;
  setYear: (year: number) => void;
}

export function LunarCalendarControls({
  year,
  setYear,
}: LunarCalendarControlsProps) {
  const years = generateYearOptions();

  return (
    <div className="space-y-3">
      {/* Year Selector */}
      <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
        <SelectTrigger className="w-full h-10 bg-lunar-surface/50 border-border/30">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
