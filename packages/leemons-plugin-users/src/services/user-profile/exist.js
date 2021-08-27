const { table } = require('../tables');

/**
 * Return if exist user profile
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {any} transacting - DB transaction
 * @return {Promise<boolean>}
 * */
async function exist(user, profile, { transacting } = {}) {
  const count = await table.userProfile.count({ user, profile }, { transacting });
  return !!count;
}

module.exports = { exist };
