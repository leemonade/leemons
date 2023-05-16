const _ = require('lodash');
const { table } = require('../tables');

async function filterUserAgentsByProfileAndCenter(
  userAgentIds,
  profile,
  center,
  { transacting } = {}
) {
  // eslint-disable-next-line no-nested-ternary
  const profiles = profile ? (_.isArray(profile) ? profile : [profile]) : [];
  // eslint-disable-next-line no-nested-ternary
  const centers = center ? (_.isArray(center) ? center : [center]) : [];
  const profileQuery = profiles.length ? { profile_$in: profiles } : {};
  const profileRoles = await table.profileRole.find(profileQuery, {
    columns: ['role'],
    transacting,
  });
  let roleIds = [];
  if (centers.length) {
    const centerRole = await table.roleCenter.find(
      {
        center_$in: centers,
        role_$in: _.map(profileRoles, 'role'),
      },
      { columns: ['role'], transacting }
    );
    roleIds = _.map(centerRole, 'role');
  } else {
    roleIds = _.map(profileRoles, 'role');
  }
  const userAgents = await table.userAgent.find(
    {
      id_$in: userAgentIds,
      role_$in: roleIds,
    },
    { columns: ['id'], transacting }
  );
  return _.map(userAgents, 'id');
}

module.exports = { filterUserAgentsByProfileAndCenter };
