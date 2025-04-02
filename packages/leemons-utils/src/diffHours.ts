/**
 * Calculates the absolute difference in hours between two dates
 * @param dt2 - The second date
 * @param dt1 - The first date
 * @returns The absolute difference in hours between the two dates, rounded to the nearest hour
 */
function diffHours(dt2: Date, dt1: Date): number {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

export { diffHours };
