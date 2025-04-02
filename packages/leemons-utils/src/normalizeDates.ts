import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

interface NormalizeDateParams {
  date: Date | string;
  timezone: string;
}

interface CreateDateInTimezoneParams {
  dateString: string;
  timezone: string;
}

/**
 * Normalizes a date to the specified timezone
 * @param params - The parameters for date normalization
 * @param params.date - The date to normalize
 * @param params.timezone - The timezone to normalize to (e.g., 'Europe/Madrid')
 * @returns The normalized date
 */
function normalizeDate({ date, timezone }: NormalizeDateParams): Date {
  // Asumimos que el servidor está en Dublín
  // const serverTime = dayjs.tz(date, 'Europe/Dublin');
  const serverTime = dayjs(date);

  // Convertimos a la zona horaria objetivo
  const normalizedTime = serverTime.tz(timezone);

  return normalizedTime.toDate();
}

/**
 * Creates a Date object for a given date string and timezone
 * @param params - The parameters for date creation
 * @param params.dateString - The date string in "YYYY-MM-DD" format
 * @param params.timezone - The timezone to use (e.g., 'Europe/Madrid')
 * @returns The Date object in the specified timezone
 */
function createDateInTimezone({ dateString, timezone }: CreateDateInTimezoneParams): Date {
  // Create a dayjs object with the date string in the specified timezone
  const date = dayjs.tz(dateString, timezone);

  // Return the Date object
  return date.toDate();
}

export { normalizeDate, createDateInTimezone };
