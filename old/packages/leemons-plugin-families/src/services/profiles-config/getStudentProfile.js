const { table } = require('../tables');

/**
 * Returns which platform profile corresponds to student
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getStudentProfile({ transacting } = {}) {
  const response = await table.profilesConfig.findOne({ type: 'student' });
  if (response) return response.profile;
  return null;
}

module.exports = { getStudentProfile };
