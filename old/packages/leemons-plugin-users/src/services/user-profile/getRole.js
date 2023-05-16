const { table } = require('../tables');

async function getRole(user, profile, { transacting } = {}) {
  const userProfile = await table.userProfile.findOne(
    { user, profile },
    {
      columns: ['role'],
      transacting,
    }
  );
  if (userProfile) return userProfile.role;
  return null;
}

module.exports = { getRole };
