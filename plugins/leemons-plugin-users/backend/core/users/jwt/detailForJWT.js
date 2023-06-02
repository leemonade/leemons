const _ = require('lodash');
const { verifyJWTToken } = require('./verifyJWTToken');
const { table } = require('../../tables');

/**
 * Return the user for the id provided
 * We have two detail functions because possibly in the future detail will return a lot of
 * information not necessary for the backend validation logic.
 * @public
 * @static
 * @param {string} jwtToken
 * @param {boolean} forceOnlyUser
 * @param {boolean} forceOnlyUserAgent
 * @return {Promise<User>}
 * */
async function detailForJWT(jwtToken, forceOnlyUser, forceOnlyUserAgent) {
  const payload = await verifyJWTToken(jwtToken);
  let result;
  if (payload.userAgent) {
    const userAgent = await table.userAgent.findOne({ id: payload.userAgent });
    if (userAgent.disabled) throw new Error('User agent is disabled');
    if (!userAgent) throw new Error('No user auth found for the id provided');
    if (forceOnlyUserAgent) return userAgent;
    const user = await table.users.findOne({ id: userAgent.user });
    if (!user) throw new Error('No user found for the id provided');
    if (forceOnlyUser) return { ...user, sessionConfig: payload.sessionConfig || {} };
    result = user;
    result.userAgents = [userAgent];
  } else {
    const user = await table.users.findOne({ id: payload.id });
    if (!user) throw new Error('No user found for the id provided');
    result = user;
    result.userAgents = [];
  }

  result.sessionConfig = payload.sessionConfig;

  return result;
}

module.exports = { detailForJWT };
