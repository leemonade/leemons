const _ = require('lodash');
const { table } = require('../../tables');

/**
 *
 * @public
 * @static
 * @param {string|string[]|*} _fromUserAgent - User agent id/s
 * @param {string|string[]|*} _toUserAgent - User agent id/s
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function removeUserAgentContacts(
  _fromUserAgent,
  _toUserAgent,
  { target = null, transacting: _transacting } = {}
) {
  const fromUserAgents = _.isArray(_fromUserAgent) ? _fromUserAgent : [_fromUserAgent];
  const toUserAgents = _.isArray(_toUserAgent) ? _toUserAgent : [_toUserAgent];
  return global.utils.withTransaction(
    async (transacting) => {
      const pluginName = this.calledFrom;

      const query = {
        fromUserAgent_$in: fromUserAgents,
        toUserAgent_$in: toUserAgents,
        pluginName,
        target,
      };

      if (_fromUserAgent === '*') {
        delete query.fromUserAgent_$in;
      }
      if (_toUserAgent === '*') {
        delete query.toUserAgent_$in;
      }

      return table.userAgentContacts.deleteMany(query, { transacting });
    },
    table.userAgentContacts,
    _transacting
  );
}

module.exports = { removeUserAgentContacts };
