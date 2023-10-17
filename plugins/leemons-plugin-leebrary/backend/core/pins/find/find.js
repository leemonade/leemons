/**
 * Finds pins based on the provided query and columns.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.query - The query to use when finding pins.
 * @param {string[]} params.columns - The columns to select.
 * @param {Context} params.ctx - The Moleculer context object.
 * @returns {Promise<LibraryPin[]>} A promise that resolves with the found pin documents.
 */

async function find({ query, columns, ctx }) {
  return ctx.tx.db.Pins.find(query).select(columns).lean();
}

module.exports = { find };
