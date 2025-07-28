import { useState, useEffect } from "react";
import { LunarCalendarControls } from "./LunarCalendarControls";
import { LunarCalendarGrid } from "./LunarCalendarGrid";
import { getLocationName, PRESET_LOCATIONS } from "@/utils/lunar-calculations";
export function LunarCalendar() {
  const [year, setYear] = useState(2025);
  const [latitude, setLatitude] = useState(40.7128);
  const [longitude, setLongitude] = useState(-74.0060);
  const [selectedLocation, setSelectedLocation] = useState("40.7128,-74.0060");
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarTitle, setCalendarTitle] = useState("");
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

      // Update title based on location selection
      let titleText = year.toString();
      if (selectedLocation !== 'custom') {
        // Find the selected city name
        const selectedOption = PRESET_LOCATIONS.find(loc => loc.value === selectedLocation);
        const cityName = selectedOption?.label || 'Unknown';
        titleText += ` | ${cityName} (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`;
      } else {
        // For custom coordinates, try to get location name
        try {
          const locationName = await getLocationName(latitude, longitude);
          titleText += ` | ${locationName} (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`;
        } catch (error) {
          // Fallback to just coordinates if reverse geocoding fails
          titleText += ` | ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
        }
      }
      setCalendarTitle(titleText);
      setShowCalendar(true);
    } catch (error) {
      console.error('Error generating calendar:', error);
      alert('Error generating calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate calendar when year or location changes
  useEffect(() => {
    generateCalendar();
  }, [year, latitude, longitude]);
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
                latitude={latitude} 
                setLatitude={setLatitude} 
                longitude={longitude} 
                setLongitude={setLongitude} 
                selectedLocation={selectedLocation} 
                setSelectedLocation={setSelectedLocation} 
              />
            </div>

            {/* Calendar Title */}
            {showCalendar && !isLoading && <div className="space-y-2">
                
                {calendarTitle.includes(' | ')}
              </div>}

            {/* Loading State */}
            {isLoading && <p className="text-muted-foreground font-light text-lg">
                Calculating lunar phases...
              </p>}
          </div>
        </div>

        {/* Calendar Display */}
        {showCalendar && !isLoading && <div className="px-3 sm:px-6 pb-12 sm:pb-20">
            <LunarCalendarGrid year={year} latitude={latitude} longitude={longitude} />
          </div>}
      </div>
    </div>;
}