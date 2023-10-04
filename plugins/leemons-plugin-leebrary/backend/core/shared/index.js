const normalizeItemsArray = require('./normalizeItemsArray');
const isTruthy = require('./isTruthy');
const metascraper = require('./metascraper');
const escapeRegExp = require('./escapeRegExp');

module.exports = {
  ...normalizeItemsArray,
  ...isTruthy,
  ...metascraper,
  ...escapeRegExp,
};
