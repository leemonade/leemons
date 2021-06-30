const _ = require('lodash');
const { getSuperAdminUserIds } = require('./getSuperAdminUserIds');

/**
 * Return if user is super admin
 * @public
 * @static
 * @param {string} userId - User id to check
 * @return {Promise<boolean>} If is super admin return true if not false
 * */
async function isSuperAdmin(userId) {
  const superAdminUsersIds = await getSuperAdminUserIds();
  return _.includes(superAdminUsersIds, userId);
}

module.exports = { isSuperAdmin };
