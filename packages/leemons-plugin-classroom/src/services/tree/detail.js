const { table } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function detail({ transacting } = {}) {
  const results = await table.treeLevel.find({ transacting });

  return results;
}

module.exports = { detail };
