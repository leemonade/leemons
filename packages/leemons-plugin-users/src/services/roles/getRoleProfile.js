const { table } = require('../tables');

async function getRoleProfile(roleId, { transacting } = {}) {
  const profileRole = await table.profileRole.findOne(
    { role: roleId },
    {
      columns: ['profile'],
      transacting,
    }
  );
  if (profileRole) return profileRole.profile;
  return null;
}

module.exports = { getRoleProfile };
