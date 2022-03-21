const { tables } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function getById(id, { transacting } = {}) {
  const results = await tables.files.findOne({ id }, { transacting });
  return Array.isArray(results) ? results[0] : null;
}

module.exports = { getById };
