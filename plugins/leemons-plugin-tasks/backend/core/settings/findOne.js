/**
 * Retrieves settings data.
 *
 * @param {MoleculerContext} ctx - The moleculer context
 * @returns {Promise<Array>} - A promise that resolves to an array
 */

async function findOne({ ctx }) {
  const results = await ctx.tx.db.Settings.find().limit(1).lean();
  return Array.isArray(results) ? results[0] : null;
}

module.exports = { findOne };
