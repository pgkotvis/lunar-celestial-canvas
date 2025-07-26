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

  // Generate calendar on component mount
  useEffect(() => {
    generateCalendar();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-lunar text-foreground">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-[0.2em] text-foreground mb-4 uppercase font-mono">
            Lunar Calendar
          </h1>
        </div>

        {/* Controls */}
        <LunarCalendarControls
          year={year}
          setYear={setYear}
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          onGenerate={generateCalendar}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="text-lg text-muted-foreground animate-pulse">
              Calculating lunar phases
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}

        {/* Calendar */}
        {showCalendar && !isLoading && (
          <div className="bg-card border border-border rounded-lg p-8 shadow-lunar">
            <div className="text-center mb-8">
              <h2 className="text-xl font-light tracking-wider text-foreground font-mono">
                {calendarTitle}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 hidden md:block">
                Click on any day to see moon phase details
              </p>
            </div>
            
            <LunarCalendarGrid
              year={year}
              latitude={latitude}
              longitude={longitude}
            />
          </div>
        )}
      </div>
    </div>
  );
}