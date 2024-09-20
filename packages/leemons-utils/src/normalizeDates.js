const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Normalizes a date to the specified timezone
 * @param {Object} params
 * @param {Date|string} params.date - The date to normalize
 * @param {string} params.timezone - The timezone to normalize to (e.g., 'Europe/Madrid')
 * @returns {Date} - The normalized date
 */
function normalizeDate({ date, timezone }) {
  // Asumimos que el servidor está en Dublín
  // const serverTime = dayjs.tz(date, 'Europe/Dublin');
  const serverTime = dayjs(date);

  // Convertimos a la zona horaria objetivo
  const normalizedTime = serverTime.tz(timezone);

  return normalizedTime.toDate();
}

/**
 * Creates a Date object for a given date string and timezone
 * @param {Object} params
 * @param {string} params.dateString - The date string in "YYYY-MM-DD" format
 * @param {string} params.timezone - The timezone to use (e.g., 'Europe/Madrid')
 * @returns {Date} - The Date object in the specified timezone
 */
function createDateInTimezone({ dateString, timezone }) {
  // Create a dayjs object with the date string in the specified timezone
  const date = dayjs.tz(dateString, timezone);

  // Return the Date object
  return date.toDate();
}

module.exports = {
  normalizeDate,
  createDateInTimezone,
};
