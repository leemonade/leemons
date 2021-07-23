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
  const userAuths = await table.userAuth.find({ user }, { columns: ['role'], transacting });
  const profileRoles = await table.profileRole.find(
    { role_$in: _.map(userAuths, 'role') },
    { transacting }
  );
  return table.profiles.find({ id_$in: _.map(profileRoles, 'profile') }, { transacting });
}

module.exports = profiles;
