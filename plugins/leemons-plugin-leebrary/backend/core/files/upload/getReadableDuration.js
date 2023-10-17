const { pad } = require('./pad');
/**
 * Converts milliseconds to a readable duration format (HH:MM:SS or MM:SS).
 *
 * @param {Object} params - The params object
 * @param {number} params.duration - The duration in milliseconds.
 * @param {boolean} params.padStart - Whether to pad the hours with leading zeros.
 * @returns {string} The duration in a readable format.
 */
function getReadableDuration({ duration, padStart }) {
  const asSeconds = duration / 1000;

  let hours;
  let minutes = Math.floor(asSeconds / 60);
  const seconds = Math.floor(asSeconds % 60);

  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    minutes %= 60;
  }

  const formattedHours = `${padStart ? pad(hours) : hours}`;
  const formattedMinutes = `${padStart ? pad(minutes) : minutes}`;

  return hours
    ? `${formattedHours}:${pad(minutes)}:${pad(seconds)}`
    : `${formattedMinutes}:${pad(seconds)}`;
}

module.exports = { getReadableDuration };
