/**
 * Retrieves block(s) by their ID(s) from the database.
 *
 * @param {Object} params - The parameters for the function.
 * @param {String|Array<String>} params.id - The ID or IDs of the blocks to retrieve.
 * @param {Object} params.ctx - The context object containing the database connection.
 * @returns {Promise<(Object|null|Array<Object>)>} A promise that resolves to the block(s) found, or null if none are found.
 */
async function getBlockById({ id, ctx }) {
  const multipleIds = Array.isArray(id);
  const normalizedId = multipleIds ? id : [id];
  const results = await ctx.tx.db.Blocks.find({ id: { $in: normalizedId } }).lean();

  if (!multipleIds) {
    return results[0] ?? null;
  }

  return results;
}

module.exports = { getBlockById };
