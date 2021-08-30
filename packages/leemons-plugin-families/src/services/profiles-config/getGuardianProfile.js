const { table } = require('../tables');

/**
 * Returns which platform profile corresponds to guardian
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getGuardianProfile({ transacting } = {}) {
  const response = await table.profilesConfig.findOne({ type: 'guardian' });
  if (response) return response.profile;
  return null;
}

module.exports = { getGuardianProfile };
