const { set } = require('lodash');

async function getDates({ type, instance, ctx }) {
  if (!type || !instance) {
    throw new Error('Cannot get dates: type and instance are required');
  }

  if (!Array.isArray(instance)) {
    const dates = await getDates({ type, instance: [instance], ctx });

    return dates[instance] ?? {};
  }

  const datesFound = await ctx.tx.db.Dates.find({
    type,
    instance: { $in: instance },
  })
    .select(['instance', 'name', 'date'])
    .lean();

  const datesByInstance = {};

  datesFound.forEach((date) => {
    set(datesByInstance, `${date.instance}.${date.name}`, date.date);
  });

  return datesByInstance;
}

module.exports = { getDates };
