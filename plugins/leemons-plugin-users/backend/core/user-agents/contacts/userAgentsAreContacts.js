const _ = require('lodash');

/**
 * ES: Comprueba sin el from tiene acceso a ver al to
 * @public
 * @static
 * @param {string|string[]} fromUserAgent - User agent id/s
 * @param {string|string[]} toUserAgent - User agent id/s
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function userAgentsAreContacts({ fromUserAgent, toUserAgent, ctx }) {
  const response = await ctx.tx.db.UserAgentContacts.countDocuments({
    fromUserAgent: _.isArray(fromUserAgent) ? fromUserAgent : [fromUserAgent],
    toUserAgent: _.isArray(toUserAgent) ? toUserAgent : [toUserAgent],
  }).lean();
  return !!response;
}

module.exports = { userAgentsAreContacts };
