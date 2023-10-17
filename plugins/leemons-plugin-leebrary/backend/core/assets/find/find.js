/**
 * Finds assets based on the provided query and columns.
 *
 * @param {object} params - The parameters for the find operation.
 * @param {object} [params.query] - The query to use when finding assets.
 * @param {string | string[]} [params.columns] - The columns to select in the find operation.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<object[]>} - Returns a Promise that resolves to an array of found assets.
 */

async function find({ query, columns, ctx }) {
  return ctx.tx.db.Assets.find(query).select(columns).lean();
}

module.exports = { find };
