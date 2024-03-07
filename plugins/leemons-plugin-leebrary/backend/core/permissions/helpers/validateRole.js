const { roles } = require('../../../config/constants');

/**
 * Validates if the provided role is included in the predefined roles.
 *
 * @param {string} role - The role to be validated.
 * @returns {boolean} - Returns true if the role is valid, false otherwise.
 */
function validateRole(role) {
  return roles.includes(role);
}

module.exports = validateRole;
