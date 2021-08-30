const crypto = require('crypto');

/**
 * Generate long random string
 * @public
 * @static
 * @return {string}
 * */
function randomString(size = 32) {
  return 'rs' + crypto.randomBytes(size - 2).toString('hex');
}

module.exports = randomString;
