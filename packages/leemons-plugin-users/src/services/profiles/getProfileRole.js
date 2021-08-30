const { table } = require('../tables');

async function getProfileRole(profileId, { transacting } = {}) {
  const profileRole = await table.profiles.findOne(
    { id: profileId },
    {
      columns: ['role'],
      transacting,
    }
  );
  if (profileRole) return profileRole.role;
  return null;
}

module.exports = getProfileRole;
