const _ = require('lodash');
const { getSuperAdminUserIds } = require('./getSuperAdminUserIds');

/**
 * Return if user is super admin
 * @public
 * @static
 * @param {string} userId - User id to check
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>} If is super admin return true if not false
 * */
async function isSuperAdmin(userId, { transacting } = {}) {
  const superAdminUsersIds = await getSuperAdminUserIds({ transacting });
  return _.includes(superAdminUsersIds, userId);
}

module.exports = { isSuperAdmin };
