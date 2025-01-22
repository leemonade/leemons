const { groupBy } = require('lodash');

/**
 * Retrieves a custom period by its item.
 *
 * @param {object} params - The parameters for retrieving a custom period.
 * @param {string[]} params.items - The LRN ID items of the custom periods to retrieve.
 * @param {MoleculerContext} params.ctx - The context object containing transactional connection details.
 * @returns {Promise<object>} An object with the LRN ID items as keys and the custom period objects as values.
 */
async function getByItems({ items, ctx }) {
  const results = await ctx.tx.db.CustomPeriod.find({ item: items }).lean();

  return groupBy(results, 'item');
}

module.exports = { getByItems };
