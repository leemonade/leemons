const { table } = require('../tables');

/**
 * It says that the platform profile corresponds to a student
 * @public
 * @static
 * @param {string} profile - Profile id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setStudentProfile(profile, { transacting } = {}) {
  return await table.profilesConfig.set(
    { type: 'student' },
    {
      type: 'student',
      profile,
    },
    { transacting }
  );
}

module.exports = { setStudentProfile };
