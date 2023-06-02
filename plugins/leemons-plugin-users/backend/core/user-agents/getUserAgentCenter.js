const _ = require('lodash');
const { table } = require('../tables');

/**
 * Return the user agent/s center/s
 * @public
 * @static
 * @param {UserAgent|UserAgent[]} userAgent - Id or ids of user agents
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function getUserAgentCenter(userAgent, { transacting } = {}) {
  const isArray = _.isArray(userAgent);
  const userAgents = isArray ? userAgent : [userAgent];
  const roleCenters = await table.roleCenter.find(
    { role_$in: _.map(userAgents, 'role') },
    {
      columns: ['center'],
      transacting,
    }
  );
  const centers = await table.centers.find(
    { id_$in: _.map(roleCenters, 'center') },
    { transacting }
  );
  return isArray ? centers : centers[0];
}

module.exports = { getUserAgentCenter };
