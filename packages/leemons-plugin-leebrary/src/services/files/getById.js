const { tables } = require('../tables');
const { parseMetadata } = require('./helpers/parseMetadata');

/**
 * Fetches a file by its ID.
 * @param {string} id - The ID of the file.
 * @param {Object} options - The options object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object|null>} The file object or null if not found.
 */
async function getById(id, { transacting } = {}) {
  const item = await tables.files.findOne({ id }, { transacting });
  return item ? parseMetadata(item) : null;
}

module.exports = { getById };
