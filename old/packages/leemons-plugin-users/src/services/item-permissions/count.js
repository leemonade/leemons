const { table } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function count(...params) {
  return table.itemPermissions.count(...params);
}

module.exports = { count };
