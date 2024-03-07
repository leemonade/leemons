const _ = require('lodash');

/**
 *
 * @public
 * @static
 * @param {string|string[]|*} _fromUserAgent - User agent id/s
 * @param {string|string[]|*} _toUserAgent - User agent id/s
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function removeUserAgentContacts({
  fromUserAgent: _fromUserAgent,
  toUserAgent: _toUserAgent,
  target = null,
  ctx,
}) {
  const fromUserAgents = _.isArray(_fromUserAgent) ? _fromUserAgent : [_fromUserAgent];
  const toUserAgents = _.isArray(_toUserAgent) ? _toUserAgent : [_toUserAgent];
  const query = {
    fromUserAgent: fromUserAgents,
    toUserAgent: toUserAgents,
    pluginName: ctx.callerPlugin,
    target,
  };

  if (_fromUserAgent === '*') {
    delete query.fromUserAgent;
  }
  if (_toUserAgent === '*') {
    delete query.toUserAgent;
  }

  return ctx.tx.db.UserAgentContacts.deleteMany(query);
}

module.exports = { removeUserAgentContacts };
