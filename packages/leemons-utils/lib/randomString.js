const crypto = require('crypto');

/**
 * Generate long random string
 * @public
 * @static
 * @return {string}
 * */
function randomString(size = 32) {
  return crypto.randomBytes(size).toString('hex');
}

module.exports = randomString;
