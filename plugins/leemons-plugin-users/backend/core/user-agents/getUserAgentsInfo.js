/* eslint-disable no-param-reassign */

const _ = require('lodash');

/**
 * Gets detailed information about user agents that meet the specified parameters.
 *
 * @public
 * @static
 * @param {Object} params - The parameters for searching user agents.
 * @param {string[]} params.userAgentIds - An array of user agent IDs to search for.
 * @param {boolean} [params.withProfile=false] - Indicates whether profile information should be included.
 * @param {boolean} [params.withCenter=false] - Indicates whether center information should be included.
 * @param {string[]} [params.userColumns=['id', 'email', 'name', 'surnames', 'secondSurname', 'birthdate', 'avatar', 'gender', 'createdAt']] - An array of user columns to select.
 * @param {import('@leemons/deployment-manager').Context} params.ctx - The context including the database transaction.
 * @returns {UserAgent[]} - An array of objects representing user agents with detailed information.
 * */
async function getUserAgentsInfo({
  userAgentIds,
  withProfile,
  withCenter,
  userColumns = [
    'id',
    'email',
    'name',
    'surnames',
    'secondSurname',
    'birthdate',
    'avatar',
    'gender',
    'createdAt',
  ],
  ctx,
}) {
  const userAgents = await ctx.tx.db.UserAgent.find({ id: userAgentIds })
    .select(['id', 'user', 'role', 'disabled'])
    .lean();

  const users = await ctx.tx.db.Users.find({ id: _.map(userAgents, 'user') })
    .select(userColumns)
    .lean();

  const roles = _.uniq(_.map(userAgents, 'role'));

  const usersById = _.keyBy(users, 'id');
  let profileRoleByRole = null;
  let profilesById = null;
  let roleCentersByRole = null;
  let centerById = null;

  if (withProfile) {
    const profileRole = await ctx.tx.db.ProfileRole.find({ role: roles }).lean();
    const profiles = await ctx.tx.db.Profiles.find({
      $or: [{ id: _.map(profileRole, 'profile') }, { role: roles }],
    }).lean();
    profileRoleByRole = _.keyBy(profileRole, 'role');
    profilesById = _.keyBy(profiles, 'id');
  }
  if (withCenter) {
    const centerRole = await ctx.tx.db.RoleCenter.find({ role: roles }).lean();
    const centers = await ctx.tx.db.Centers.find({ id: _.map(centerRole, 'center') }).lean();
    roleCentersByRole = _.keyBy(centerRole, 'role');
    centerById = _.keyBy(centers, 'id');
  }

  return _.map(userAgents, (userAgent) => {
    userAgent.user = usersById[userAgent.user];
    if (profileRoleByRole && profilesById && profileRoleByRole[userAgent.role]) {
      userAgent.profile = profilesById[profileRoleByRole[userAgent.role].profile];
    }
    if (roleCentersByRole && centerById && roleCentersByRole[userAgent.role]) {
      userAgent.center = centerById[roleCentersByRole[userAgent.role].center];
    }
    return userAgent;
  });
}

module.exports = { getUserAgentsInfo };
