/**
 * Retrieves categories by their keys.
 *
 * @async
 * @function getByKeys
 * @param {Object} params - The main parameter object.
 * @param {Array<string>} params.keys - The keys of the categories to retrieve.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<object>>} The categories corresponding to the provided keys.
 */
function getByKeys({ keys, ctx }) {
  return ctx.tx.db.Categories.find({ key: keys });
}

module.exports = { getByKeys };
