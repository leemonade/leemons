const _ = require('lodash');
const { table } = require('../tables');

async function getRolesCenters(roleIds, { raw, transacting } = {}) {
  const centerRoles = await table.roleCenter.find(
    { role_$in: roleIds },
    {
      columns: ['id', 'center', 'role'],
      transacting,
    }
  );
  if (raw) return centerRoles;
  return _.map(centerRoles, 'center');
}

module.exports = { getRolesCenters };
