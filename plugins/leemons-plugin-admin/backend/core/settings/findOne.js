/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function findOne({ ctx }) {
  const results = await ctx.tx.db.Settings.find().lean();
  return Array.isArray(results) ? results[0] : null;
}

module.exports = findOne;
