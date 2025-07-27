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
  // Major World Cities
  { value: "40.7128,-74.0060", label: "New York City, USA" },
  { value: "34.0522,-118.2437", label: "Los Angeles, USA" },
  { value: "41.8781,-87.6298", label: "Chicago, USA" },
  { value: "29.7604,-95.3698", label: "Houston, USA" },
  { value: "33.4484,-112.0740", label: "Phoenix, USA" },
  { value: "39.9526,-75.1652", label: "Philadelphia, USA" },
  { value: "32.7767,-96.7970", label: "Dallas, USA" },
  { value: "37.7749,-122.4194", label: "San Francisco, USA" },
  { value: "47.6062,-122.3321", label: "Seattle, USA" },
  { value: "25.7617,-80.1918", label: "Miami, USA" },
  { value: "42.3601,-71.0589", label: "Boston, USA" },
  { value: "43.6532,-79.3832", label: "Toronto, Canada" },
  { value: "45.5017,-73.5673", label: "Montreal, Canada" },
  { value: "49.2827,-123.1207", label: "Vancouver, Canada" },
  { value: "51.5074,-0.1278", label: "London, UK" },
  { value: "55.7558,37.6176", label: "Moscow, Russia" },
  { value: "48.8566,2.3522", label: "Paris, France" },
  { value: "52.5200,13.4050", label: "Berlin, Germany" },
  { value: "41.9028,12.4964", label: "Rome, Italy" },
  { value: "40.4168,-3.7038", label: "Madrid, Spain" },
  { value: "59.3293,18.0686", label: "Stockholm, Sweden" },
  { value: "60.1699,24.9384", label: "Helsinki, Finland" },
  { value: "55.6761,12.5683", label: "Copenhagen, Denmark" },
  { value: "47.3769,8.5417", label: "Zurich, Switzerland" },
  { value: "50.0755,14.4378", label: "Prague, Czech Republic" },
  { value: "35.6762,139.6503", label: "Tokyo, Japan" },
  { value: "37.5665,126.9780", label: "Seoul, South Korea" },
  { value: "39.9042,116.4074", label: "Beijing, China" },
  { value: "31.2304,121.4737", label: "Shanghai, China" },
  { value: "22.3193,114.1694", label: "Hong Kong" },
  { value: "1.3521,103.8198", label: "Singapore" },
  { value: "28.6139,77.2090", label: "New Delhi, India" },
  { value: "19.0760,72.8777", label: "Mumbai, India" },
  { value: "13.0827,80.2707", label: "Chennai, India" },
  { value: "-33.8688,151.2093", label: "Sydney, Australia" },
  { value: "-37.8136,144.9631", label: "Melbourne, Australia" },
  { value: "-27.4698,153.0251", label: "Brisbane, Australia" },
  { value: "-23.5505,-46.6333", label: "São Paulo, Brazil" },
  { value: "-22.9068,-43.1729", label: "Rio de Janeiro, Brazil" },
  { value: "-34.6037,-58.3816", label: "Buenos Aires, Argentina" },
  { value: "19.4326,-99.1332", label: "Mexico City, Mexico" },
  { value: "-33.4489,-70.6693", label: "Santiago, Chile" },
  { value: "30.0444,31.2357", label: "Cairo, Egypt" },
  { value: "-26.2041,28.0473", label: "Johannesburg, South Africa" },
  { value: "-33.9249,18.4241", label: "Cape Town, South Africa" },
  { value: "6.5244,3.3792", label: "Lagos, Nigeria" },
  { value: "41.0082,28.9784", label: "Istanbul, Turkey" },
  { value: "55.7558,37.6173", label: "Moscow, Russia" },
  { value: "25.2048,55.2708", label: "Dubai, UAE" },
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