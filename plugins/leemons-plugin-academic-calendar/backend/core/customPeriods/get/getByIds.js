/**
 * Retrieves multiple custom periods by their IDs.
 *
 * @param {object} params - The parameters for retrieving custom periods.
 * @param {string[]} params.ids - The unique identifiers of the custom periods.
 * @param {MoleculerContext} params.ctx - The context object containing transactional connection details.
 * @returns {Promise<object[]>} An array of custom period objects if found, otherwise an empty array.
 */
async function getByIds({ ids, ctx }) {
  return ctx.tx.db.CustomPeriods.find({ id: ids }).lean();
}

module.exports = { getByIds };
