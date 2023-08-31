/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

/**
 * Returns all agents that meet the specified parameters.
 * @public
 * @static
 * @param {string[]} userAgentIds - To search
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */

async function getUserAgentsInfo(
  userAgentIds,
  {
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
      'created_at',
    ],
    transacting,
  } = {}
) {
  const userAgents = await table.userAgent.find(
    { id_$in: userAgentIds },
    {
      columns: ['id', 'user', 'role', 'disabled'],
      transacting,
    }
  );

  const users = await table.users.find(
    { id_$in: _.map(userAgents, 'user') },
    {
      columns: userColumns,
      transacting,
    }
  );

  const roles = _.uniq(_.map(userAgents, 'role'));

  const usersById = _.keyBy(users, 'id');
  let profileRoleByRole = null;
  let profilesById = null;
  let roleCentersByRole = null;
  let centerById = null;

  if (withProfile) {
    const profileRole = await table.profileRole.find({ role_$in: roles }, { transacting });
    const profiles = await table.profiles.find(
      {
        $or: [{ id_$in: _.map(profileRole, 'profile') }, { role_$in: roles }],
      },
      { transacting }
    );
    profileRoleByRole = _.keyBy(profileRole, 'role');
    profilesById = _.keyBy(profiles, 'id');
  }
  if (withCenter) {
    const centerRole = await table.roleCenter.find({ role_$in: roles }, { transacting });
    const centers = await table.centers.find(
      { id_$in: _.map(centerRole, 'center') },
      { transacting }
    );
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
