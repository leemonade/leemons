const { getByCenterId: getCenterConfigByCenter } = require('../center-calendar-configs');
const { detail } = require('./detail');

/**
 *
 * @public
 * @static
 * @param {any} center - Center id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getByCenterId(center, { transacting } = {}) {
  const centerConfig = await getCenterConfigByCenter(center, { transacting });
  if (centerConfig) return detail(centerConfig.config, { transacting });
  return null;
}

module.exports = { getByCenterId };
