const _ = require('lodash');
const { getGuardianProfile, getStudentProfile } = require('../profiles-config');

/**
 * Returns user agent for specipif filters
 * @public
 * @static
 * @param {string} profileType - Profile type to search guardian | student
 * @param {any} query - Query params
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function searchUsers(profileType, query, { transacting } = {}) {
  let profile = null;
  if (profileType === 'guardian') profile = await getGuardianProfile({ transacting });
  if (profileType === 'student') profile = await getStudentProfile({ transacting });
  const userAgents = await leemons.getPlugin('users').services.users.searchUserAgents(
    {
      ...query,
      profile,
    },
    { transacting }
  );
  const userIds = [];
  const users = [];
  _.forEach(userAgents, (userAgent) => {
    if (userIds.indexOf(userAgent.user.id) < 0) {
      userIds.push(userAgent.user.id);
      users.push(userAgent.user);
    }
  });
  return users;
}

module.exports = { searchUsers };
