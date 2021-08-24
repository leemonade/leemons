const { table } = require('../tables');

/**
 * It says that the platform profile corresponds to a guardian
 * @public
 * @static
 * @param {string} profile - Profile id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setGuardianProfile(profile, { transacting } = {}) {
  return await table.profilesConfig.set(
    { type: 'guardian' },
    {
      type: 'guardian',
      profile,
    },
    { transacting }
  );
}

module.exports = { setGuardianProfile };
