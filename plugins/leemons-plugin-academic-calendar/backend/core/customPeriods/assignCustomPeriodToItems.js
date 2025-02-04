const { validateAssignCustomPeriodToItems } = require('../../validations/forms');

/**
 * Assigns a custom period to multiple items.
 *
 * @param {Object} params - The parameters for assigning custom periods.
 * @param {Array<{item: string, type: string}>} params.items - The academic items to which the custom period is to be assigned.
 * @param {Object} params.dates - The date range for the custom period.
 * @param {string} params.dates.startDate - The start date of the custom period.
 * @param {string} params.dates.endDate - The end date of the custom period.
 * @param {Context} params.ctx - The Moleculer context, which provides access to the database and other services.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful.
 */

async function assignCustomPeriodToItems({ items, dates, ctx }) {
  validateAssignCustomPeriodToItems({ data: { items, dates }, ctx });

  const promises = items.map(({ item, type }) =>
    ctx.tx.db.CustomPeriod.updateOne(
      { item },
      {
        $set: {
          ...dates,
          type,
          item,
        },
      },
      { upsert: true }
    )
  );

  const results = await Promise.all(promises);

  return results.every((result) => result.acknowledged);
}

module.exports = { assignCustomPeriodToItems };
