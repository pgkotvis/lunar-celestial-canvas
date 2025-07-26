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
    <div className="flex flex-wrap gap-4 items-end justify-center mb-12 p-6 bg-card border">
      <div className="flex flex-col gap-2">
        <Label htmlFor="year" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Year
        </Label>
        <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
          <SelectTrigger className="w-40 bg-lunar-surface border-border">
            <SelectValue />
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="location" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Location
        </Label>
        <Select value={selectedLocation} onValueChange={handleLocationChange}>
          <SelectTrigger className="w-40 bg-lunar-surface border-border">
            <SelectValue />
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="latitude" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Latitude
        </Label>
        <Input
          id="latitude"
          type="number"
          step="0.0001"
          value={latitude}
          onChange={(e) => {
            setLatitude(parseFloat(e.target.value) || 0);
            handleCoordinateChange();
          }}
          className="w-40 bg-lunar-surface border-border"
          placeholder="40.7128"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="longitude" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Longitude
        </Label>
        <Input
          id="longitude"
          type="number"
          step="0.0001"
          value={longitude}
          onChange={(e) => {
            setLongitude(parseFloat(e.target.value) || 0);
            handleCoordinateChange();
          }}
          className="w-40 bg-lunar-surface border-border"
          placeholder="-74.0060"
        />
      </div>

      <Button 
        onClick={onGenerate} 
        disabled={isLoading}
        className="w-40 px-6 py-2 font-medium tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
    </div>
  );
}