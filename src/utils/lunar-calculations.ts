import * as SunCalc from "suncalc";

// Moon illumination is computed purely from Earth-Sun-Moon geometry,
// so it does not depend on observer location.
export function getMoonIllumination(date: Date): number {
  return SunCalc.getMoonIllumination(date).fraction;
}

// SunCalc's `phase` (0-1, 0/1 = new, 0.25 = first quarter, 0.5 = full,
// 0.75 = last quarter) encodes waxing/waning direction, unlike illumination
// fraction which is symmetric around the full moon and can't distinguish them.
export function getMoonPhaseName(date: Date): string {
  const phase = SunCalc.getMoonIllumination(date).phase;
  if (phase < 1 / 16 || phase >= 15 / 16) return "New Moon";
  if (phase < 3 / 16) return "Waxing Crescent";
  if (phase < 5 / 16) return "First Quarter";
  if (phase < 7 / 16) return "Waxing Gibbous";
  if (phase < 9 / 16) return "Full Moon";
  if (phase < 11 / 16) return "Waning Gibbous";
  if (phase < 13 / 16) return "Last Quarter";
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