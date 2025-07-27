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
    <div className="relative">
      {/* Month Labels */}
      <div className="grid grid-cols-12 gap-px mb-2 sm:mb-3 md:mb-5 text-center">
        {MONTH_NAMES.map((month, index) => (
          <div 
            key={index} 
            className="text-xs sm:text-sm font-medium py-1 sm:py-2 px-1 text-muted-foreground uppercase tracking-wider"
          >
            <span className="hidden sm:inline">{month}</span>
            <span className="sm:hidden">{month.slice(0, 3)}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid: 12 columns (months) x maxDays rows (days) */}
      <div 
        className="grid grid-cols-12 gap-px bg-lunar-shadow p-px max-w-full mx-auto"
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
                  className="aspect-square min-h-[8px] sm:min-h-[10px] md:min-h-[12px] transition-all duration-150 cursor-pointer hover:scale-110 hover:z-10 hover:border hover:border-primary relative"
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
                  className="aspect-square min-h-[8px] sm:min-h-[10px] md:min-h-[12px] bg-transparent"
                />
              );
            }
          });
        }).flat()}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed pointer-events-none z-50 bg-card border border-border px-3 py-2 text-sm shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          <div className="font-semibold">{tooltip.date}</div>
          <div className="text-muted-foreground">
            Illumination: {tooltip.illumination}%
          </div>
          <div className="text-muted-foreground">
            ({tooltip.phase})
          </div>
        </div>
      )}
    </div>
  );
}