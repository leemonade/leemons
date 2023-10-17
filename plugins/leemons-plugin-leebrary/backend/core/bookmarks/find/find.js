/**
 * Finds bookmarks based on the provided query and columns.
 * @param {Object} params - The parameters for the find operation.
 * @param {Object} params.query - The query to use for the find operation.
 * @param {Array<string>} params.columns - The columns to select in the find operation.
 * @param {Object} params.ctx - The moleculer context.
 * @returns {Promise<Array<Object>>} The found bookmarks.
 */
async function find({ query, columns, ctx }) {
  return ctx.tx.db.Bookmarks.find(query).select(columns).lean();
}

module.exports = { find };
