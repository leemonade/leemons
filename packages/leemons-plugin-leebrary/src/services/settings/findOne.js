const { tables } = require('../tables');

/**
 * Finds and returns the first setting from the settings table.
 * @async
 * @param {Object} params - The parameters for the search.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Object|null>} The first setting object if found, otherwise null.
 */
async function findOne({ transacting } = {}) {
  const results = await tables.settings.find({ $limit: 1 }, { transacting });
  return Array.isArray(results) ? results[0] : null;
}

module.exports = { findOne };
