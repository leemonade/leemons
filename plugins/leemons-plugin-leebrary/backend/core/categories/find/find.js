/**
 * This function is used to find categories based on the provided query and columns.
 * It returns a promise that resolves to an array of found categories, if any.
 *
 * @async
 * @function find
 * @param {Object} params - The main parameter object.
 * @param {Object} params.query - The query to find categories.
 * @param {Array<string>} params.columns - The columns to select.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<Object>>} The found categories if any.
 * @throws {LeemonsError} When the function fails to find categories.
 */
async function find({ query, columns, ctx }) {
  return ctx.tx.db.Categories.find(query).select(columns).lean();
}

module.exports = { find };
