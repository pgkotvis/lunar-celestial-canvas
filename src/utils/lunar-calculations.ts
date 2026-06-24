import * as SunCalc from "suncalc";

// Moon illumination is computed purely from Earth-Sun-Moon geometry,
// so it does not depend on observer location.
export function getMoonIllumination(date: Date): number {
  return SunCalc.getMoonIllumination(date).fraction;
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

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function generateYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 1980; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return years;
}