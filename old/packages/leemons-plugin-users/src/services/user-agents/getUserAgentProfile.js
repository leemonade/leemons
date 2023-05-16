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
async function getUserAgentProfile(userAgent, { transacting } = {}) {
  const isArray = _.isArray(userAgent);
  const userAgents = isArray ? userAgent : [userAgent];
  const roleProfiles = await table.profileRole.find(
    { role_$in: _.map(userAgents, 'role') },
    {
      columns: ['profile'],
      transacting,
    }
  );
  const profiles = await table.profiles.find(
    { id_$in: _.map(roleProfiles, 'profile') },
    { transacting }
  );
  return isArray ? profiles : profiles[0];
}

module.exports = { getUserAgentProfile };
