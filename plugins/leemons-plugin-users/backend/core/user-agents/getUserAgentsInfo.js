/* eslint-disable no-param-reassign */

const _ = require('lodash');

/**
 * Prepares the user agents to be returned to the client.
 *
 * @private
 * @param {object} params - The parameters to prepare the user agents.
 * @param {object[]} params.userAgents - The user agents to prepare.
 * @param {boolean} params.withProfile - Whether to include the profile in the user agents.
 * @param {object} params.profilesById - The profiles by id.
 * @param {object} params.profileRoleByRole - The profile role by role.
 * @param {object} params.usersById - The users by id.
 * @param {object} params.roleCentersByRole - The role centers by role.
 * @param {object} params.centerById - The center by id.
 * @returns {UserAgent[]} The prepared user agents.
 * */
function prepareUserAgents({
  userAgents,
  withProfile,
  profilesById,
  profileRoleByRole,
  usersById,
  roleCentersByRole,
  centerById,
}) {
  return _.map(userAgents, (ua) => {
    const userAgent = { ...ua };
    userAgent.user = usersById[userAgent.user];
    if (profileRoleByRole && profilesById && profileRoleByRole[userAgent.role]) {
      userAgent.profile = profilesById[profileRoleByRole[userAgent.role].profile];
    }

    if (roleCentersByRole && centerById && roleCentersByRole[userAgent.role]) {
      userAgent.center = centerById[roleCentersByRole[userAgent.role].center];
    }

    // Handle the SuperAdmin profile usecase
    if (withProfile && profilesById && !userAgent.profile) {
      const profileId = Object.keys(profilesById).find(
        (id) => profilesById[id].role === userAgent.role
      );
      const profile = profilesById[profileId];
      if (profile?.sysName === 'super') {
        userAgent.profile = profile;
      }
    }

    return userAgent;
  });
}

/**
 * Retrieves user agents based on the specified parameters.
 *
 * @public
 * @static
 * @param {Object} params - The parameters for searching user agents.
 * @param {string[]} params.userAgentIds - An array of user agent IDs to search for.
 * @param {boolean} [params.withProfile=false] - Indicates whether profile information should be included.
 * @param {boolean} [params.withCenter=false] - Indicates whether center information should be included.
 * @param {string[]} [params.userColumns=['id', 'email', 'name', 'surnames', 'secondSurname', 'birthdate', 'avatar', 'gender', 'createdAt']] - An array of user columns to select.
 * @param {import('@leemons/deployment-manager').Context} params.ctx - The context including the database transaction.
 * @returns {Promise<UserAgent[]>} - An array of objects representing user agents with detailed information.
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

  if (roles?.length > 0) {
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
  }

  return prepareUserAgents({
    userAgents,
    withProfile,
    profilesById,
    profileRoleByRole,
    usersById,
    roleCentersByRole,
    centerById,
  });
}

module.exports = { getUserAgentsInfo };
