const _ = require('lodash');
const { table } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function findOne({ transacting } = {}) {
  const results = await table.settings.find({ transacting });
  return Array.isArray(results) ? results[0] : null;
}

module.exports = findOne;
