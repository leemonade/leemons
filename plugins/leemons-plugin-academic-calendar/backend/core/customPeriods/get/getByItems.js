/**
 * Retrieves a custom period by its item.
 *
 * @param {object} params - The parameters for retrieving a custom period.
 * @param {string[]} params.items - The LRN ID items of the custom periods to retrieve.
 * @param {MoleculerContext} params.ctx - The context object containing transactional connection details.
 * @returns {Promise<Record<string, CustomPeriod>>} An object where keys are LRN ID items and values are the corresponding custom periods.
 */
async function getByItems({ items, ctx }) {
  const results = await ctx.tx.db.CustomPeriod.find({ item: items }).lean();

  return results.reduce(
    (acc, period) => ({
      ...acc,
      [period.item]: period,
    }),
    {}
  );
}

module.exports = { getByItems };
