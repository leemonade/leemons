const _ = require('lodash');
const { table } = require('../tables');

async function getRolesProfiles(roleIds, { raw, transacting } = {}) {
  const profilesRoles = await table.profileRole.find(
    { role_$in: roleIds },
    {
      columns: ['id', 'profile', 'role'],
      transacting,
    }
  );
  if (raw) return profilesRoles;
  return _.map(profilesRoles, 'profile');
}

module.exports = { getRolesProfiles };
