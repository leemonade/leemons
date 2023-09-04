const { tables } = require('../tables');

/**
 * Get files by user
 * 
 * @param {string} userId - The user ID.
 * @param {Object} options - The options object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Array>} The array of files.
 */
async function getByUser(userId, { transacting } = {}) {
  const results = await tables.files.find({ fromUser: userId }, { transacting });
  return results.map((item) => {
    const data = { ...item };
    if (data.metadata) data.metadata = JSON.parse(data.metadata);
    return data;
  });
}

module.exports = { getByUser };
