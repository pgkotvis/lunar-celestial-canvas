// Astronomical calculations for moon phases
export function getMoonIllumination(date: Date, lat: number = 0, lng: number = 0): number {
  const d = date.getTime() / 86400000 - 10957.5; // days since J2000
  
  // Moon's orbital elements
  const L = (218.316 + 13.176396 * d) % 360; // mean longitude
  const M = (134.963 + 13.064993 * d) % 360; // mean anomaly
  const F = (93.272 + 13.229350 * d) % 360;  // argument of latitude
  
  // Convert to radians
  const Lr = L * Math.PI / 180;
  const Mr = M * Math.PI / 180;
  const Fr = F * Math.PI / 180;
  
  // Calculate illuminated fraction
  const sunLng = (280.459 + 0.98564736 * d) % 360;
  const sunLngR = sunLng * Math.PI / 180;
  
  const elongation = Math.acos(Math.cos(sunLngR - Lr) * Math.cos(0));
  const phaseAngle = Math.atan2(Math.sin(elongation), Math.cos(elongation));
  
  // Illuminated fraction (0 to 1)
  const illumination = (1 + Math.cos(phaseAngle)) / 2;
  
  return Math.max(0, Math.min(1, illumination));
}

export function getMoonPhaseName(illumination: number): string {
  if (illumination < 0.1) return "New Moon";
  if (illumination < 0.3) return "Waxing Crescent";
  if (illumination < 0.7) return "First Quarter";
  if (illumination < 0.9) return "Waxing Gibbous";
  if (illumination > 0.9) return "Full Moon";
  if (illumination > 0.7) return "Waning Gibbous";
  if (illumination > 0.3) return "Last Quarter";
  return "Waning Crescent";
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getDaysInMonth(year: number, month: number): number {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 1 && isLeapYear(year)) return 29;
  return days[month];
}

export async function getLocationName(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      let locationName = '';
      
      // Priority order: city, town, village, municipality, county, state
      if (address.city) {
        locationName = address.city;
      } else if (address.town) {
        locationName = address.town;
      } else if (address.village) {
        locationName = address.village;
      } else if (address.municipality) {
        locationName = address.municipality;
      } else if (address.county) {
        locationName = address.county;
      } else if (address.state) {
        locationName = address.state;
      } else if (address.country) {
        locationName = address.country;
      }
      
      // Add country if we have a city/town and it's not the same as country
      if (locationName && address.country && locationName !== address.country) {
        locationName += `, ${address.country}`;
      }
      
      return locationName || 'Unknown Location';
    } else {
      return 'Unknown Location';
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return 'Unknown Location';
  }
}

export const PRESET_LOCATIONS = [
  { value: "custom", label: "Custom" },
  { value: "40.7128,-74.0060", label: "New York City" },
  { value: "51.5074,-0.1278", label: "London" },
  { value: "48.8566,2.3522", label: "Paris" },
  { value: "35.6762,139.6503", label: "Tokyo" },
  { value: "-33.8688,151.2093", label: "Sydney" },
  { value: "34.0522,-118.2437", label: "Los Angeles" },
  { value: "55.7558,37.6176", label: "Moscow" },
  { value: "19.4326,-99.1332", label: "Mexico City" },
  { value: "28.6139,77.2090", label: "New Delhi" },
  { value: "-23.5505,-46.6333", label: "São Paulo" },
];

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function generateYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 1980; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return years;
}