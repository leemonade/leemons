/**
 * Retrieves a custom period by its item.
 *
 * @param {object} params - The parameters for retrieving a custom period.
 * @param {string} params.item - The LRN ID item of the custom period to retrieve.
 * @param {MoleculerContext} params.ctx - The context object containing transactional connection details.
 * @returns {Promise<object>} The custom period object if found, otherwise null.
 */
async function getByItem({ item, ctx }) {
  return ctx.tx.db.CustomPeriods.findOne({ item }).lean();
}

module.exports = { getByItem };
