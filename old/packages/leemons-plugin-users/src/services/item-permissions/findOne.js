const { table } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function findOne(id, { transacting } = {}) {
  const result = await table.itemPermissions.findOne({ id }, { transacting });
  return result;
}

module.exports = { findOne };
