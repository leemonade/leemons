const crypto = require('crypto');

module.exports = function hash(object) {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(object))
    .digest('base64')
    .replace(/=/g, '');
};
