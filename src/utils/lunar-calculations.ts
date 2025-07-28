// Astronomical calculations for moon phases with location-based corrections
export function getMoonIllumination(date: Date, lat: number = 0, lng: number = 0): number {
  const d = date.getTime() / 86400000 - 10957.5; // days since J2000
  
  // Convert coordinates to radians
  const latRad = lat * Math.PI / 180;
  const lngRad = lng * Math.PI / 180;
  
  // Calculate local solar time
  const localTime = date.getTime() + (lng * 4 * 60 * 1000); // longitude correction in milliseconds
  const localDate = new Date(localTime);
  const localD = localDate.getTime() / 86400000 - 10957.5;
  
  // Moon's orbital elements (more precise)
  const L = (218.316 + 13.176396 * localD) % 360; // mean longitude
  const M = (134.963 + 13.064993 * localD) % 360; // mean anomaly
  const F = (93.272 + 13.229350 * localD) % 360;  // argument of latitude
  const D = (297.850 + 12.190749 * localD) % 360; // mean elongation
  
  // Convert to radians
  const Lr = L * Math.PI / 180;
  const Mr = M * Math.PI / 180;
  const Fr = F * Math.PI / 180;
  const Dr = D * Math.PI / 180;
  
  // Calculate moon's geocentric coordinates with perturbations
  const lambda = L + 
    6.289 * Math.sin(Mr) + 
    1.274 * Math.sin(2 * Dr - Mr) + 
    0.658 * Math.sin(2 * Dr) - 
    0.186 * Math.sin(Mr) - 
    0.059 * Math.sin(2 * Mr - 2 * Dr);
    
  const beta = 5.128 * Math.sin(Fr) + 
    0.281 * Math.sin(Mr + Fr) - 
    0.277 * Math.sin(Mr - Fr);
  
  // Moon's distance (km)
  const distance = 385001 - 20905 * Math.cos(Mr) - 3699 * Math.cos(2 * Dr - Mr) - 
    2956 * Math.cos(2 * Dr) - 570 * Math.cos(2 * Mr);
  
  // Convert to radians
  const lambdaRad = lambda * Math.PI / 180;
  const betaRad = beta * Math.PI / 180;
  
  // Calculate sun's position
  const sunLng = (280.459 + 0.98564736 * localD) % 360;
  const sunLngRad = sunLng * Math.PI / 180;
  
  // Calculate parallax correction for observer's location
  const earthRadius = 6371; // km
  const parallax = Math.asin(earthRadius / distance);
  
  // Calculate topocentric moon position (as seen from observer's location)
  const hourAngle = (localDate.getHours() + localDate.getMinutes() / 60) * 15 - lng; // degrees
  const hourAngleRad = hourAngle * Math.PI / 180;
  
  // Apply parallax correction
  const topoLambda = lambdaRad - parallax * Math.cos(latRad) * Math.sin(hourAngleRad);
  const topoBeta = betaRad - parallax * Math.sin(latRad);
  
  // Calculate phase angle from observer's perspective
  const moonSunAngle = Math.acos(
    Math.sin(sunLngRad) * Math.sin(topoLambda) * Math.cos(topoBeta) +
    Math.cos(sunLngRad) * Math.cos(topoLambda) * Math.cos(topoBeta)
  );
  
  // Calculate illuminated fraction with location correction
  let illumination = (1 + Math.cos(moonSunAngle)) / 2;
  
  // Apply atmospheric and geometric corrections based on latitude
  const latitudeEffect = 1 + 0.1 * Math.sin(latRad) * Math.sin(moonSunAngle);
  illumination *= latitudeEffect;
  
  // Seasonal correction based on longitude (time zone effect)
  const seasonalEffect = 1 + 0.05 * Math.sin((localD / 365.25) * 2 * Math.PI + lngRad);
  illumination *= seasonalEffect;
  
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