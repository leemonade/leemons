/**
 * Check if the room key already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function exist({ key, ctx }) {
  const count = await ctx.tx.db.Room.countDocuments({ key });
  return !!count;
}

module.exports = { exist };
