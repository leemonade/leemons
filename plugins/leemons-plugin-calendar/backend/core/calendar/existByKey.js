/**
 * Check if the calendar key already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function existByKey({ key, ctx }) {
  const count = await ctx.tx.db.Calendars.countDocuments({ key });
  return !!count;
}

module.exports = { existByKey };
