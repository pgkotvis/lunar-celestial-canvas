import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PRESET_LOCATIONS, generateYearOptions } from "@/utils/lunar-calculations";

interface LunarCalendarControlsProps {
  year: number;
  setYear: (year: number) => void;
  latitude: number;
  setLatitude: (lat: number) => void;
  longitude: number;
  setLongitude: (lng: number) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export function LunarCalendarControls({
  year,
  setYear,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  selectedLocation,
  setSelectedLocation,
  onGenerate,
  isLoading
}: LunarCalendarControlsProps) {
  const years = generateYearOptions();

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    if (value !== 'custom') {
      const [lat, lng] = value.split(',');
      setLatitude(parseFloat(lat));
      setLongitude(parseFloat(lng));
    }
  };

  const handleCoordinateChange = () => {
    // Check if current coordinates match any preset location
    const currentCoords = `${latitude},${longitude}`;
    const matchingLocation = PRESET_LOCATIONS.find(loc => loc.value === currentCoords);
    
    if (matchingLocation) {
      setSelectedLocation(matchingLocation.value);
    } else {
      setSelectedLocation('custom');
    }
  };

  return (
    <div className="space-y-5">
      {/* Primary Controls Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Year Selector */}
        <div>
          <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
            <SelectTrigger className="w-full h-12 bg-lunar-surface/50 border-border/30">
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

        {/* Location Selector */}
        <div>
          <Select value={selectedLocation} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-full h-12 bg-lunar-surface/50 border-border/30">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {PRESET_LOCATIONS.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Coordinate Inputs - Only show when custom is selected */}
      {selectedLocation === 'custom' && (
        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/20">
          <Input
            id="latitude"
            type="number"
            step="0.0001"
            value={latitude}
            onChange={(e) => {
              setLatitude(parseFloat(e.target.value) || 0);
              handleCoordinateChange();
            }}
            className="w-full h-12 bg-lunar-surface/50 border-border/30"
            placeholder="Latitude (e.g., 40.7128)"
          />
          <Input
            id="longitude"
            type="number"
            step="0.0001"
            value={longitude}
            onChange={(e) => {
              setLongitude(parseFloat(e.target.value) || 0);
              handleCoordinateChange();
            }}
            className="w-full h-12 bg-lunar-surface/50 border-border/30"
            placeholder="Longitude (e.g., -74.0060)"
          />
        </div>
      )}

      {/* Generate Button */}
      <Button 
        onClick={onGenerate} 
        disabled={isLoading}
        className="w-full h-12 mt-6 font-light tracking-wide bg-primary/90 text-primary-foreground hover:bg-primary"
        size="lg"
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
    </div>
  );
}