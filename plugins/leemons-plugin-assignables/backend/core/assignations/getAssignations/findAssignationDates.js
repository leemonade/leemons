const _ = require('lodash');

async function findAssignationDates({ assignationsIds, ctx }) {
  const datesFound = await ctx.tx.db.Dates.find({ type: 'assignation', instance: assignationsIds })
    .select(['instance', 'name', 'date'])
    .lean();

  const datesPerAssignation = {};

  datesFound.forEach((date) => {
    const { instance, name: key, date: value } = date;
    _.set(datesPerAssignation, `${instance}.${key}`, value);
  });

  return datesPerAssignation;
}

module.exports = { findAssignationDates };
