/**
 * Retrieves multiple custom periods by their type.
 *
 * @param {object} params - The parameters for retrieving custom periods.
 * @param {string} params.type - The type of the custom period. An academic portfolio entity: subject, class
 * @param {MoleculerContext} params.ctx - The context object containing transactional connection details.
 * @returns {Promise<object[]>} An array of custom period objects if found, otherwise an empty array.
 */
async function getByType({ type, ctx }) {
  return ctx.tx.db.CustomPeriod.find({ type }).lean();
}

module.exports = { getByType };
