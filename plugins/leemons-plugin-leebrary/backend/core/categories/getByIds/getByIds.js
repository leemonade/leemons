/**
 * Retrieves categories by their IDs. If the required fields are not provided, a LeemonsError is thrown.
 *
 * @async
 * @function getByIds
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.categoriesIds - The IDs of the categories to retrieve.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<object>>} The categories if they are found, null otherwise.
 * @throws {LeemonsError} If the required fields are not provided, a LeemonsError is thrown.
 */
function getByIds({ categoriesIds, ctx }) {
  return ctx.tx.db.Categories.find({ id: categoriesIds }).lean();
}

module.exports = { getByIds };
