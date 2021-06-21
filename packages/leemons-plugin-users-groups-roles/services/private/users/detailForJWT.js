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
 * @return {Promise<User>}
 * */
async function detailForJWT(jwtToken) {
  const payload = await verifyJWTToken(jwtToken);
  let result;

  if (payload.userAuth) {
    const userAuth = await table.userAuth.findOne({ id: payload.userAuth });
    if (!userAuth) throw new Error('No user auth found for the id provided');
    const user = await table.users.findOne({ id: userAuth.user });
    if (!user) throw new Error('No user found for the id provided');
    result = _.assign(user, userAuth);
    result.id = userAuth.id;
    result.user = user.id;
  } else {
    const user = await table.users.findOne({ id: payload.id });
    if (!user) throw new Error('No user found for the id provided');
    user.user = user.id;
    result = user;
  }

  return result;
}

module.exports = { detailForJWT };
