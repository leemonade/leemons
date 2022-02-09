const { keyBy } = require('lodash');
const { table } = require('../tables');
const { getProfiles } = require('./getProfiles');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function isProfilesConfig({ transacting } = {}) {
  const profiles = await getProfiles({ transacting });
  return !!profiles.teacher && !!profiles.student;
}

module.exports = { isProfilesConfig };
