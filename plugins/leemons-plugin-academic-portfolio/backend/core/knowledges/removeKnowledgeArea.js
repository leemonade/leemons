/**
 * Removes a subject type by its ID.
 * @param {Object} params - The function parameters.
 * @param {string} params.id - The ID of the subject type to remove.
 * @param {boolean} params.soft - Determines if the removal is soft.
 * @param {Object} params.ctx - The moleculer context object containing.
 * @returns {Promise<boolean>} The promise that resolves to true if an entry was deleted.
 */
async function removeKnowledgeArea({ id, soft, ctx }) {
  const result = await ctx.tx.db.KnowledgeAreas.deleteOne({ id }, { soft });
  return result.deletedCount > 0;
}

module.exports = { removeKnowledgeArea };
