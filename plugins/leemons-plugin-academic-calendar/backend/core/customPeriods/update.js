const { LeemonsError } = require('@leemons/errors');

const { validateUpdateCustomPeriod } = require('../../validations/forms');

/**
 * Updates a custom period's start and end dates.
 *
 * @param {object} params - The parameters for updating a custom period.
 * @param {string} params.item - The LRN ID item of the custom period to update.
 * @param {Date} params.startDate - The new start date for the custom period.
 * @param {Date} params.endDate - The new end date for the custom period.
 * @param {Moleculer.Context} params.ctx - The context object containing transactional connection details.
 * @returns {Promise<object>} The updated custom period object.
 * @throws {LeemonsError} If the custom period is not found.
 */
async function update({ item, startDate, endDate, ctx }) {
  validateUpdateCustomPeriod({ item, startDate, endDate });
  const customPeriod = await ctx.tx.db.CustomPeriods.findOne({ item });

  if (!customPeriod) {
    throw new LeemonsError(ctx, { message: 'Custom period not found' });
  }

  return ctx.tx.db.CustomPeriods.findOneAndUpdate(
    { item },
    { startDate, endDate },
    { lean: true, new: true }
  );
}

module.exports = { update };
