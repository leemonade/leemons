const crypto = require('crypto');

/**
 * Generate long random string
 * @public
 * @static
 * @return {string}
 * */
function randomString(size = 32) {
  return `rs${crypto.webcrypto
    .getRandomValues(new Uint8Array(size - 2))
    .reduce(
      (t, e) =>
        (t +=
          (e &= 63) < 36
            ? e.toString(36)
            : e < 62
            ? (e - 26).toString(36).toUpperCase()
            : e > 62
            ? '-'
            : '_'),
      ''
    )}`;
}

module.exports = randomString;
