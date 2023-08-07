/**
 * Check if the calendar key already exists
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function exist({ id, ctx }) {
  const count = await ctx.tx.db.Calendars.countDocuments({ id });
  return !!count;
}

module.exports = { exist };
