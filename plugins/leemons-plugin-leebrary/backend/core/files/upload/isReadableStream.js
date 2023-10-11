const stream = require('stream');
/**
 * Checks if the provided object is a readable stream.
 *
 * @param {Object} obj - The object to check.
 * @returns {boolean} True if the object is a readable stream, false otherwise.
 */
function isReadableStream(obj) {
  return (
    obj instanceof stream.Stream &&
    typeof obj._read === 'function' &&
    typeof obj._readableState === 'object'
  );
}

module.exports = { isReadableStream };
