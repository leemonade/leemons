const { map } = require('lodash');

async function getActivitiesDates({ instances, assignations, filters, ctx }) {
  const { status, progress, isArchived, sort, studentDidOpen, studentCanSee } = filters;

  if (!(status || progress || isArchived !== undefined || studentDidOpen !== undefined || sort)) {
    return {};
  }

  const instancesIds = map(instances || [], 'id');
  const assignationsIds = map(assignations || [], 'id');

  const instanceNames = [];
  const assignationNames = [];

  if (status || progress) {
    instanceNames.push('start', 'deadline', 'closed');

    if (progress) {
      assignationNames.push('start', 'end');
    }
  }
  if (studentDidOpen !== undefined) {
    assignationNames.push('open');
  }

  if (isArchived !== undefined) {
    instanceNames.push('archived');
  }

  if (['start', 'deadline'].includes(sort)) {
    instanceNames.push('start', 'deadline');
  }

  if (studentCanSee) {
    instanceNames.push('visibility', 'start');
  }

  const dates = await ctx.tx.db.Dates.find({
    $or: [
      {
        type: 'assignableInstance',
        name: instanceNames,
        instance: instancesIds,
      },
      {
        type: 'assignation',
        name: assignationNames,
        instance: assignationsIds,
      },
    ],
  }).lean();

  const assignationDates = {};
  const instanceDates = {};

  dates.forEach((date) => {
    const typeDates = date.type === 'assignableInstance' ? instanceDates : assignationDates;

    if (typeDates[date.instance]) {
      typeDates[date.instance][date.name] = date.date;
    } else {
      typeDates[date.instance] = {
        [date.name]: date.date,
      };
    }
  });

  return {
    instances: instanceDates,
    assignations: assignationDates,
  };
}
module.exports = { getActivitiesDates };
