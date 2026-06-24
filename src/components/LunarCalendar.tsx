import { useState, useEffect } from "react";
import { LunarCalendarControls } from "./LunarCalendarControls";
import { LunarCalendarGrid } from "./LunarCalendarGrid";
export function LunarCalendar() {
  const [year, setYear] = useState(2025);
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const generateCalendar = async () => {
    if (!year) {
      alert('Please select a valid year');
      return;
    }
    setIsLoading(true);
    setShowCalendar(false);
    try {
      // Small delay to show loading animation
      await new Promise(resolve => setTimeout(resolve, 100));
      setShowCalendar(true);
    } catch (error) {
      console.error('Error generating calendar:', error);
      alert('Error generating calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate calendar when year changes
  useEffect(() => {
    generateCalendar();
  }, [year]);
  return <div className="min-h-screen bg-gradient-lunar text-foreground">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="px-4 sm:px-6 pt-8 sm:pt-12 pb-4 sm:pb-6">
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight tracking-[0.15em] text-foreground">
              Lunar Calendar
            </h1>
            
            {/* Controls */}
            <div className="max-w-sm mx-auto">
              <LunarCalendarControls
                year={year}
                setYear={setYear}
              />
            </div>

            {/* Loading State */}
            {isLoading && <p className="text-muted-foreground font-light text-lg">
                Calculating lunar phases...
              </p>}
          </div>
        </div>

        {/* Calendar Display */}
        {showCalendar && !isLoading && <div className="px-3 sm:px-6 pb-12 sm:pb-20">
            <LunarCalendarGrid year={year} />
          </div>}
      </div>
    </div>;
}