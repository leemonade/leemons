const { tables } = require('../tables');

/**
 * Check if a file exists in the database
 * 
 * @param {string} fileId - The ID of the file to check
 * @param {object} options - The options object
 * @param {object} options.transacting - The transaction object
 * @returns {Promise<boolean>} - Returns true if the file exists, false otherwise
 */
async function exists(fileId, { transacting } = {}) {
  const count = await tables.files.count({ id: fileId }, { transacting });
  return count > 0;
}

module.exports = { exists };
