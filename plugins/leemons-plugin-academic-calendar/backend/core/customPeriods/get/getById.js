/**
 * Retrieves a custom period by its ID.
 *
 * @param {object} params - The parameters for retrieving a custom period.
 * @param {string} params.id - The unique identifier of the custom period.
 * @param {MoleculerContext} params.ctx - The context object containing transactional connection details.
 * @returns {Promise<object>} The custom period object if found, otherwise null.
 */

async function getById({ id, ctx }) {
  return ctx.tx.db.CustomPeriod.findOne({ id }).lean();
}

module.exports = { getById };
