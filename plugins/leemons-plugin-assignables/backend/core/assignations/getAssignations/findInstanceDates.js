const _ = require('lodash');

async function findInstanceDates({ instances, ctx }) {
  const datesFound = await ctx.tx.db.Dates.find({ type: 'assignableInstance', instance: instances })
    .select(['instance', 'name', 'date'])
    .lean();

  const datesPerInstance = {};

  datesFound.forEach((date) => {
    const { instance, name: key, date: value } = date;
    _.set(datesPerInstance, `${instance}.${key}`, value);
  });

  return datesPerInstance;
}

module.exports = { findInstanceDates };
