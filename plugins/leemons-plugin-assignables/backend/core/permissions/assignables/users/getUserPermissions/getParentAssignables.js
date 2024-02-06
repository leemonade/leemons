/**
 * Retrieves the parent assignables based on the given ids and context.
 *
 * @param {Object} params - The parameters for retrieving the parent assignables.
 * @param {Array} params.ids - The array of ids to filter the parent assignables.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Array} - The parent assignables.
 */
function getParentAssignables({ ids, ctx }) {
  if (!ids.length) {
    return [];
  }
  return ctx.tx.db.Assignables.find({
    $or: ids.map((id) => ({
      'submission.activities.activity': id,
    })),
  })
    .select({ asset: true, id: true, _id: false })
    .lean();
}

module.exports = {
  getParentAssignables,
};
