const { table } = require('../tables');

/**
 *
 * @public
 * @static
 * @param {any} config - Config id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function listByConfigId(config, { transacting } = {}) {
  return table.centerCalendarConfigs.find({ config }, { transacting });
}

module.exports = { listByConfigId };
