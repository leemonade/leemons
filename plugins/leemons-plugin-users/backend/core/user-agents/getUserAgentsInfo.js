/* eslint-disable no-param-reassign */
const _ = require('lodash');

/**
 * Returns all agents that meet the specified parameters.
 * @public
 * @static
 * @param {string[]} userAgentIds - To search
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */

async function getUserAgentsInfo({
  userAgentIds,
  withProfile,
  withCenter,
  userColumns = [
    '_id',
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
  const userAgents = await ctx.tx.db.UserAgent.find({ _id: userAgentIds })
    .select(['_id', 'user', 'role', 'disabled'])
    .lean();

  const users = await ctx.tx.db.Users.find({ _id: _.map(userAgents, 'user') })
    .select(userColumns)
    .lean();

  const roles = _.uniq(_.map(userAgents, 'role'));

  const usersById = _.keyBy(users, '_id');
  let profileRoleByRole = null;
  let profilesById = null;
  let roleCentersByRole = null;
  let centerById = null;

  if (withProfile) {
    const profileRole = await ctx.tx.db.ProfileRole.find({ role: roles }).lean();
    const profiles = await ctx.tx.db.Profiles.find({
      $or: [{ _id: _.map(profileRole, 'profile') }, { role: roles }],
    }).lean();
    profileRoleByRole = _.keyBy(profileRole, 'role');
    profilesById = _.keyBy(profiles, '_id');
  }
  if (withCenter) {
    const centerRole = await ctx.tx.db.RoleCenter.find({ role: roles }).lean();
    const centers = await ctx.tx.db.Centers.find({ _id: _.map(centerRole, 'center') }).lean();
    roleCentersByRole = _.keyBy(centerRole, 'role');
    centerById = _.keyBy(centers, '_id');
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
