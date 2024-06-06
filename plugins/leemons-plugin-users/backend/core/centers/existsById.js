/**
 * Checks if a center exists by its ID.
 * @async
 * @function existsById
 * @param {Object} params - The function parameters.
 * @param {string} params.id - The ID of the center to check.
 * @param {Object} params.ctx - The moleculer context object.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the center exists.
 */
async function existsById({ id, ctx }) {
  const exists = await ctx.tx.db.Centers.countDocuments({ id });
  return !!exists;
}

module.exports = existsById;
