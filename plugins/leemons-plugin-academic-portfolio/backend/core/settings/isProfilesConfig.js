const { getProfiles } = require('./getProfiles');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function isProfilesConfig({ ctx } = {}) {
  const profiles = await getProfiles({ ctx });
  return !!profiles.teacher && !!profiles.student;
}

module.exports = { isProfilesConfig };
