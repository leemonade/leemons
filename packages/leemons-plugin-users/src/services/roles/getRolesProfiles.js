const _ = require('lodash');
const { table } = require('../tables');

async function getRolesProfiles(roleIds, { transacting } = {}) {
  const profilesRoles = await table.profileRole.find(
    { role_$in: roleIds },
    {
      columns: ['id', 'profile'],
      transacting,
    }
  );
  return _.map(profilesRoles, 'profile');
}

module.exports = { getRolesProfiles };
