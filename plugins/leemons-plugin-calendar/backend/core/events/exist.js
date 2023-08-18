/**
 * Check if the event id already exists
 * @public
 * @static
 * @param {string} id - Id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function exist({ id, ctx }) {
  const count = await ctx.tx.db.Events.countDocuments({ id });
  return !!count;
}

module.exports = { exist };
