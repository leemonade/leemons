const { map } = require('lodash');
const tables = require('../../../tables');

async function getActivitiesDates({ instances, assignations, filters }, { transacting }) {
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

  const dates = await tables.dates.find(
    {
      $or: [
        {
          type: 'assignableInstance',
          name_$in: instanceNames,
          instance_$in: instancesIds,
        },
        {
          type: 'assignation',
          name_$in: assignationNames,
          instance_$in: assignationsIds,
        },
      ],
    },
    { transacting }
  );

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
