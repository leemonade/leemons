const { map } = require('lodash');

/**
 * Registers dates for a given type and id.
 *
 * @param {Object} options - The options for registering dates.
 * @param {string} options.type - The type of entity.
 * @param {string} options.instance - The id.
 * @param {{[string]: string}} options.dates - An object containing date configurations.
 */
async function registerDates({ type, instance, dates, ctx }) {
  if (!type || !instance || !dates) {
    throw new Error('Cannot regster dates: type, instance and dates are required');
  }
  const datesToSave = map(dates, (date, name) => ({ type, instance, name, date }));

  await ctx.tx.db.Dates.insertMany(datesToSave);

  return {
    type,
    instance,
    dates,
  };
}

module.exports = { registerDates };
