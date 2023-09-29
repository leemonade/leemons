const normalizeItemsArray = require('./normalizeItemsArray');
const isTruthy = require('./isTruthy');
const metascraper = require('./metascraper');

module.exports = {
  ...normalizeItemsArray,
  ...isTruthy,
  ...metascraper,
};
