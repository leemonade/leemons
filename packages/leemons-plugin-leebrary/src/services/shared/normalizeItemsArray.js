const { isArray, compact, uniq } = require('lodash');

/**
 * Normalize the input to ensures it is always an array
 * @param {Array|any} items - The items
 * @returns {Array} - Returns an array of items
 */
function normalizeItemsArray(items) {
  return compact(uniq(isArray(items) ? items : [items]));
}

module.exports = { normalizeItemsArray }