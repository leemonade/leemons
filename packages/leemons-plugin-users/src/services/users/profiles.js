const _ = require('lodash');
const { table } = require('../tables');

/**
 * Return profiles for active user
 * @public
 * @static
 * @param {string} user - User id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function profiles(user, { transacting } = {}) {
  const userAgents = await table.userAgent.find({ user }, { columns: ['role'], transacting });

  const profileRoles = await table.profileRole.find(
    { role_$in: _.map(userAgents, 'role') },
    { transacting }
  );

  return table.profiles.find(
    { $or: [{ id_$in: _.map(profileRoles, 'profile') }, { role_$in: _.map(userAgents, 'role') }] },
    { transacting }
  );
}

module.exports = { profiles };
