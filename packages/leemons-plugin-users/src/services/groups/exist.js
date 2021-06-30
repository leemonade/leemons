const { table } = require('../tables');

/**
 * Check if group exists
 * @public
 * @static
 * @param {any} query
 * @param {boolean} throwErrorIfNotExists
 * @return {Promise<boolean>}
 * */
async function exist(query, throwErrorIfNotExists) {
  const count = await table.groups.count(query);
  if (throwErrorIfNotExists && !count) throw new Error('Group not found');
  return true;
}

module.exports = { exist };
