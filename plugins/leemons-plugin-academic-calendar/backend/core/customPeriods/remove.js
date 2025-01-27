/**
 * Removes a custom period by its item.
 *
 * @param {object} params - The parameters for removing a custom period.
 * @param {string} params.item - The LRN ID item which custom period we want to remove.
 * @param {MoleculerContext} params.ctx - The context object containing transactional connection details.
 * @returns {Promise<boolean>} True if the custom period was successfully removed, otherwise false.
 */
async function remove({ item, ctx }) {
  const result = await ctx.tx.db.CustomPeriod.deleteOne({ item });
  return result.deletedCount === 1;
}

module.exports = { remove };
