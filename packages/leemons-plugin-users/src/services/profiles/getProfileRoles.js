const { table } = require('../tables');

async function getProfileRoles(profileId, { transacting }) {
  const profileRole = await table.profileRole.findOne({ profile: profileId }, { transacting });
  return [profileRole];
}

module.exports = getProfileRoles;
