const _ = require('lodash');
const { table } = require('../tables');

/**
 * Return super admin user ids
 * @public
 * @static
 * @return {Promise<string[]>} Super admin ids
 * */
async function getSuperAdminUserIds({ transacting } = {}) {
  // Todo cachear ids de super administrador
  const superAdminUsers = await table.superAdminUser.find(undefined, { transacting });
  return _.map(superAdminUsers, 'user');
}

module.exports = { getSuperAdminUserIds };
