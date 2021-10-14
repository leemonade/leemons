const crypto = require('crypto');

function hash(object) {
  return crypto
    .createHash('sha1')
    .update(JSON.stringify(object))
    .digest('base64')
    .replaceAll('=', '');
}
module.exports = {
  hash,
};
