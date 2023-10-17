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
async function searchUsers({ profileType, query, ctx }) {
  let profile = null;
  if (profileType === 'guardian') profile = await getGuardianProfile({ ctx });
  if (profileType === 'student') profile = await getStudentProfile({ ctx });
  const userAgents = await ctx.tx.call('users.users.searchUserAgents', {
    ...query,
    profile,
  });

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
