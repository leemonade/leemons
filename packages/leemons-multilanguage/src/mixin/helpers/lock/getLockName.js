const { LOCK_NAME } = require('../../constants');

/**
 * Returns the lock name for the given name.
 *
 * @param {string} name - The name of the lock.
 * @returns {string} - The lock name.
 */
function getLockName(name) {
  return `${LOCK_NAME}.${name}`;
}

module.exports = { getLockName };
