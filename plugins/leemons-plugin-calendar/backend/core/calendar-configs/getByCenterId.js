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
async function getByCenterId({ center, ctx }) {
  const centerConfig = await getCenterConfigByCenter({ center, ctx });
  if (centerConfig) return detail({ id: centerConfig.config, ctx });
  return null;
}

module.exports = { getByCenterId };
