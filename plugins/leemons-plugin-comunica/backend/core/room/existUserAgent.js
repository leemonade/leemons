/**
 * Check if the user agent exist in room
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function existUserAgent({ room, userAgent, ctx }) {
  const count = await ctx.tx.db.UserAgentInRoom.countDocuments({ room, userAgent });
  return !!count;
}

module.exports = { existUserAgent };
