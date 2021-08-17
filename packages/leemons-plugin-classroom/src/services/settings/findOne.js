const _ = require('lodash');
const { table } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function findOne({ transacting } = {}) {
  const results = await table.settings.find({ $limit: 1 }, { transacting });
  console.log('findOne:', results);
  return Array.isArray(results) ? results[0] : null;
}

module.exports = findOne;
