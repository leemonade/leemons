const { tables } = require('../tables');
const { parseMetadata } = require('./helpers/parseMetadata');

/**
 * Get files by user
 * @param {string} userId - The user ID.
 * @param {Object} options - The options object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Array>} The array of files.
 */
async function getByUser(userId, { transacting } = {}) {
  const results = await tables.files.find({ fromUser: userId }, { transacting });
  return results.map(parseMetadata);
}

module.exports = { getByUser };
