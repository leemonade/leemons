const { tables } = require('../tables');

/**
 * Fetches a file by its ID.
 * 
 * @param {string} id - The ID of the file.
 * @param {Object} options - The options object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object|null>} The file object or null if not found.
 */
async function getById(id, { transacting } = {}) {
  const item = await tables.files.findOne({ id }, { transacting });
  if (!item) {
    return null;
  }

  const data = { ...item };
  if (data.metadata) data.metadata = JSON.parse(data.metadata);

  return data;
}

module.exports = { getById };
