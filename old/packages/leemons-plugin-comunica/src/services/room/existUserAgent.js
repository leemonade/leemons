const {table} = require('../tables');

/**
 * Check if the user agent exist in room
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function existUserAgent(room, userAgent, {transacting} = {}) {
  const count = await table.userAgentInRoom.count({room, userAgent}, {transacting});
  return !!count;
}

module.exports = {existUserAgent};
