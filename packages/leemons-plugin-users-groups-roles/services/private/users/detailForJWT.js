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
  const user = await table.users.findOne({ id: payload.id });
  if (!user) throw new Error('No user found for the id provided');
  return user;
}

module.exports = { detailForJWT };
