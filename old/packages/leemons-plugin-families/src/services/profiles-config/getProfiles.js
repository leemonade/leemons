const { getGuardianProfile } = require('./getGuardianProfile');
const { getStudentProfile } = require('./getStudentProfile');

/**
 * Returns which platform profile corresponds to guardian
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getProfiles({ transacting } = {}) {
  const [guardian, student] = await Promise.all([
    getGuardianProfile({ transacting }),
    getStudentProfile({ transacting }),
  ]);
  return { guardian, student };
}

module.exports = { getProfiles };
