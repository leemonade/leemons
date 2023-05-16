const _ = require('lodash');
const { table } = require('../../tables');

/**
 * ES: Comprueba sin el from tiene acceso a ver al to
 * @public
 * @static
 * @param {string|string[]} fromUserAgent - User agent id/s
 * @param {string|string[]} toUserAgent - User agent id/s
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function userAgentsAreContacts(fromUserAgent, toUserAgent, { transacting } = {}) {
  const response = await table.userAgentContacts.find(
    {
      fromUserAgent_$in: _.isArray(fromUserAgent) ? fromUserAgent : [fromUserAgent],
      toUserAgent_$in: _.isArray(toUserAgent) ? toUserAgent : [toUserAgent],
    },
    { transacting }
  );
  return !!response.length;
}

module.exports = { userAgentsAreContacts };
