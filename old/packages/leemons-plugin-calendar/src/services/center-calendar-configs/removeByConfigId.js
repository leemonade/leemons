const { table } = require('../tables');

/**
 *
 * @public
 * @static
 * @param {any} configId - Config id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeByConfigId(configId, { transacting } = {}) {
  return table.centerCalendarConfigs.deleteMany({ config: configId }, { transacting });
}

module.exports = { removeByConfigId };
