const { table } = require('../tables');

async function hasRole(profile, role, { transacting } = {}) {
  const response = await table.profileRole.count({ profile, role }, { transacting });
  return !!response;
}

module.exports = { hasRole };
