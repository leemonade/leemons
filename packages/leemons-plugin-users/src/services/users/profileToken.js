const _ = require('lodash');
const hasProfile = require('./hasProfile');
const { generateJWTToken } = require('./generateJWTToken');
const { table } = require('../tables');

/**
 * Return profiles for active user
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<string>}
 * */
async function profileToken(user, profile, { transacting } = {}) {
  if (!(await hasProfile(user, profile, { transacting })))
    throw new Error('This user don`t have this profile');
  const userAuth = await table.userAuth.findOne({ user, profile }, { transacting });
  return generateJWTToken({ userAuth: userAuth.id });
}

module.exports = profileToken;
