/**
 * Normalizes a date to the specified timezone
 * @param {Object} params
 * @param {Date|string} params.date - The date to normalize
 * @param {string} params.timezone - The timezone to normalize to (e.g., 'Europe/Madrid')
 * @returns {Date} - The normalized date
 */
function normalizeDate({ date, timezone }) {
  const inputDate = new Date(date);

  // Convert the date to the target timezone
  const options = { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const dateString = inputDate.toLocaleString('en-US', options);

  // Parse the date string back to a Date object
  const [datePart, timePart] = dateString.split(', ');
  const [month, day, year] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');

  return new Date(year, month - 1, day, hour, minute, second);
}

module.exports = {
  normalizeDate,
};
