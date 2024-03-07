/**
 * Finds a single document in the "Settings" collection.
 *
 * @async
 * @param {Object} params - The function params object
 * @param {MoleculerContext} params.ctx - The Moleculer request context.
 * @returns {Promise<Object|null>} A promise that resolves to the first settings document found or null if not found.
 */
async function findOne({ ctx }) {
  const results = await ctx.tx.db.Settings.find().limit(1).lean();
  return Array.isArray(results) && results.length ? results[0] : null;
}

module.exports = { findOne };
