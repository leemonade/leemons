/**
 * Check if the event type key already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function exist({ key, ctx }) {
  const count = await ctx.tx.db.EventTypes.countDocuments({ key });
  return !!count;
}

module.exports = { exist };
