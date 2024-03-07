async function filterByPublished({ assignablesIds: _assignablesIds, published, ctx }) {
  /**
   * Filters assignables based on their published status.
   *
   * @async
   * @function
   * @param {Object} params - Function parameters
   * @param {String[]} params.assignablesIds - Array of assignable Ids to be filtered
   * @param {boolean} params.published - Published status to filter by
   * @param {MoleculerContext} params.ctx - The Moleculer context.
   * @returns {Promise<Object[]>} Array of filtered assignables
   */

  let assignablesIds = _assignablesIds;
  assignablesIds = await ctx.tx.call('common.versionControl.getVersion', {
    id: assignablesIds,
  });

  if (published !== 'all') {
    assignablesIds = assignablesIds.filter(
      ({ published: isPublished }) => isPublished === published
    );
  }

  return assignablesIds;
}

module.exports = { filterByPublished };
