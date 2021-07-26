const _ = require('lodash');
const { verifyJWTToken } = require('./verifyJWTToken');
const { table } = require('../tables');

/**
 * Return the user for the id provided
 * We have two detail functions because possibly in the future detail will return a lot of
 * information not necessary for the backend validation logic.
 * @public
 * @static
 * @param {string} jwtToken
 * @param {boolean} forceOnlyUser
 * @param {boolean} forceOnlyUserAuth
 * @return {Promise<User>}
 * */
async function detailForJWT(jwtToken, forceOnlyUser, forceOnlyUserAuth) {
  const payload = await verifyJWTToken(jwtToken);
  let result;
  if (payload.userAuth) {
    const userAuth = await table.userAuth.findOne({ id: payload.userAuth });
    if (!userAuth) throw new Error('No user auth found for the id provided');
    if (forceOnlyUserAuth) return userAuth;
    const user = await table.users.findOne({ id: userAuth.user });
    if (!user) throw new Error('No user found for the id provided');
    if (forceOnlyUser) return user;
    result = user;
    result.userAuths = [userAuth];
  } else {
    const user = await table.users.findOne({ id: payload.id });
    if (!user) throw new Error('No user found for the id provided');
    result = user;
    result.userAuths = [];
  }

  return result;
}

module.exports = { detailForJWT };
