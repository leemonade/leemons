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
  const userAuths = await table.userAuth.find({ user }, { transacting });
  return table.profiles.find({ id_$in: _.map(userAuths, 'profile') });
}

module.exports = profiles;
