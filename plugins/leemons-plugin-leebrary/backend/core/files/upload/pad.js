/**
 * Pads a number with leading zeros.
 *
 * @param {number} num - The number to pad.
 * @returns {string} The padded number as a string.
 */
function pad(num) {
  return `${num}`.padStart(2, '0');
}

module.exports = { pad };
