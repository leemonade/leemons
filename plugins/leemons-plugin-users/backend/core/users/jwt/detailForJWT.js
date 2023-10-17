const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { verifyJWTToken } = require('./verifyJWTToken');

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
async function detailForJWT({ jwtToken, forceOnlyUser, forceOnlyUserAgent, ctx }) {
  const payload = await verifyJWTToken({ token: jwtToken, ctx });
  let result;
  if (payload.userAgent) {
    const userAgent = await ctx.tx.db.UserAgent.findOne({ id: payload.userAgent }).lean();
    if (userAgent.disabled) throw new LeemonsError(ctx, { message: 'User agent is disabled' });
    if (!userAgent)
      throw new LeemonsError(ctx, { message: 'No user auth found for the id provided' });
    if (forceOnlyUserAgent) return userAgent;
    const user = await ctx.tx.db.Users.findOne({ id: userAgent.user }).lean();
    if (!user) throw new LeemonsError(ctx, { message: 'No user found for the id provided' });
    if (forceOnlyUser) return { ...user, sessionConfig: payload.sessionConfig || {} };
    result = user;
    result.userAgents = [userAgent];
  } else {
    const user = await ctx.tx.db.Users.findOne({ id: payload.id }).lean();
    if (!user) throw new LeemonsError(ctx, { message: 'No user found for the id provided' });
    result = user;
    result.userAgents = [];
  }

  result.sessionConfig = payload.sessionConfig;

  return result;
}

module.exports = { detailForJWT };
