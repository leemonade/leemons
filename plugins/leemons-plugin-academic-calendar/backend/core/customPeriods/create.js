const { LeemonsError } = require('@leemons/errors');

const { validateCreateCustomPeriod } = require('../../validations/forms');

/**
 * Creates a new custom period in the database.
 *
 * @param {object} params - The parameters for creating a custom period.
 * @param {string} params.item - A LRN ID representing an entity of Academic Portfolio.
 * @param {Date} params.startDate - The start date of the custom period.
 * @param {Date} params.endDate - The end date of the custom period.
 * @param {string} params.type - The type of the custom period, which must match the entity of Academic Portfolio of the item
 * @param {Context} params.ctx - The context object containing transactional connection details.
 * @returns {Promise<object>} The newly created custom period object.
 * @throws {LeemonsError} If the type does not match the LRN ID segment.
 */
async function create({ item, startDate, endDate, type, ctx }) {
  validateCreateCustomPeriod({ item, startDate, endDate, type });

  // Ensure the type matches the model segment of item LRN ID. This validation might differ in the future
  const modelSegment = item.split(':')[5];
  if (type.toLowerCase() !== modelSegment.toLowerCase()) {
    throw new LeemonsError(ctx, {
      message: 'Type must match the corresponding segment of the LRN ID item',
    });
  }

  const newCustomPeriod = await ctx.tx.db.CustomPeriods.create({
    item,
    startDate,
    endDate,
    type,
  });

  return newCustomPeriod.toObject();
}

module.exports = { create };
