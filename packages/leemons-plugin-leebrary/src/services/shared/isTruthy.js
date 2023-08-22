/**
 * Checks if a value is truthy.
 * @param {string|boolean|number} value - The value to check.
 * @returns {boolean} - Returns true if the value is truthy, false otherwise.
 */
function isTruthy(value) {
  const truthyValues = ['true', true, 1, '1'];
  return truthyValues.includes(value);
}

module.exports = { isTruthy };
