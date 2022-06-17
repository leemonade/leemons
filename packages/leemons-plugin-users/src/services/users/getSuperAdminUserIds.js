const _ = require('lodash');
const { table } = require('../tables');

/**
 * Return super admin user ids
 * @public
 * @static
 * @return {Promise<string[]>} Super admin ids
 * */
async function getSuperAdminUserIds({ transacting } = {}) {
  const profile = await table.profiles.findOne(
    { uri: 'superadmin' },
    { columns: ['role'], transacting }
  );

  const userAgents = await table.userAgent.find(
    { role: profile.role },
    { columns: ['user'], transacting }
  );

  return _.map(userAgents, 'user');
}

module.exports = { getSuperAdminUserIds };
