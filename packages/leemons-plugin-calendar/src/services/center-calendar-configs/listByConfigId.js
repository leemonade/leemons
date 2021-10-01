const { table } = require('../tables');

/**
 *
 * @public
 * @static
 * @param {any} configId - Config id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function listByConfigId(configId, { transacting } = {}) {
  return table.centerCalendarConfigs.find({ config: configId }, { transacting });
}

module.exports = { listByConfigId };
