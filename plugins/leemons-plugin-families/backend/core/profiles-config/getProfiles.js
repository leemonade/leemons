const { getGuardianProfile } = require('./getGuardianProfile');
const { getStudentProfile } = require('./getStudentProfile');

/**
 * Returns which platform profile corresponds to guardian
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getProfiles({ ctx }) {
  const [guardian, student] = await Promise.all([
    getGuardianProfile({ ctx }),
    getStudentProfile({ ctx }),
  ]);
  return { guardian, student };
}

module.exports = { getProfiles };
