import { useState } from "react";
import { getMoonIllumination, getMoonPhaseName, getDaysInMonth, MONTH_NAMES } from "@/utils/lunar-calculations";

interface LunarCalendarGridProps {
  year: number;
  latitude: number;
  longitude: number;
}

interface TooltipData {
  x: number;
  y: number;
  date: string;
  illumination: string;
  phase: string;
}

export function LunarCalendarGrid({ year, latitude, longitude }: LunarCalendarGridProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Find the maximum days in any month to set grid height
  const maxDays = Math.max(...Array.from({length: 12}, (_, i) => getDaysInMonth(year, i)));

  const handleCellHover = (
    event: React.MouseEvent,
    date: Date,
    illumination: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const monthNames = MONTH_NAMES;
    const formattedDate = monthNames[date.getMonth()] + ' ' + 
                         String(date.getDate()).padStart(2, '0');

    setTooltip({
      x: event.clientX + 10,
      y: event.clientY - 50,
      date: formattedDate,
      illumination: (illumination * 100).toFixed(1),
      phase: getMoonPhaseName(illumination)
    });
  };

  const handleCellLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Month Labels */}
      <div className="grid grid-cols-12 gap-0.5 mb-3 sm:mb-4 text-center">
        {MONTH_NAMES.map((month, index) => (
          <div 
            key={index} 
            className="text-xs sm:text-sm md:text-base font-light py-2 sm:py-3 text-muted-foreground/80 tracking-wide"
          >
            <span className="hidden sm:inline">{month}</span>
            <span className="sm:hidden">{month.slice(0, 3)}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid: 12 columns (months) x maxDays rows (days) */}
      <div 
        className="grid grid-cols-12 gap-0.5 bg-lunar-shadow/30 p-1 mx-auto"
        style={{ gridTemplateRows: `repeat(${maxDays}, 1fr)` }}
      >
        {/* Generate grid: for each day (row) and each month (column) */}
        {Array.from({length: maxDays}, (_, dayIndex) => {
          const day = dayIndex + 1; // day 1-31
          
          return Array.from({length: 12}, (_, month) => {
            const daysInMonth = getDaysInMonth(year, month);
            const key = `day-${day}-month-${month}`;
            
            if (day <= daysInMonth) {
              const date = new Date(year, month, day);
              const illumination = getMoonIllumination(date, latitude, longitude);
              const grayValue = Math.round(illumination * 255);
              
              return (
                <div
                  key={key}
                  className="aspect-square min-h-[10px] sm:min-h-[14px] md:min-h-[16px] transition-all duration-200 cursor-pointer hover:scale-105 hover:z-10 hover:shadow-lg hover:shadow-primary/20 relative"
                  style={{
                    backgroundColor: `rgb(${grayValue}, ${grayValue}, ${grayValue})`,
                    color: grayValue > 127 ? 'black' : 'white'
                  }}
                  onMouseEnter={(e) => handleCellHover(e, date, illumination)}
                  onMouseLeave={handleCellLeave}
                  onMouseMove={(e) => handleCellHover(e, date, illumination)}
                />
              );
            } else {
              // Empty cell for months that don't have this day (e.g., Feb 30th)
              return (
                <div
                  key={key}
                  className="aspect-square min-h-[10px] sm:min-h-[14px] md:min-h-[16px] bg-transparent"
                />
              );
            }
          });
        }).flat()}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 bg-card/95 backdrop-blur-sm border border-border/50 px-4 py-3 text-sm shadow-xl"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          <div className="font-medium text-foreground">{tooltip.date}</div>
          <div className="text-muted-foreground text-xs mt-1">
            {tooltip.illumination}% illuminated
          </div>
          <div className="text-muted-foreground/80 text-xs">
            {tooltip.phase}
          </div>
        </div>
      )}
    </div>
  );
}