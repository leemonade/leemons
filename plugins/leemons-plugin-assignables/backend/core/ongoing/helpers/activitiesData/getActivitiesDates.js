const { map } = require('lodash');

/**
 * This function is used to get the dates of activities.
 * @async
 * @function getActivitiesDates
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.instances - The instances of the activities.
 * @param {Array} params.assignations - The assignations of the activities.
 * @param {Object} params.filters - The filters for the activities.
 * @param {Moleculer.Context} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} A promise that resolves to an object of activities dates grouped by instances and assignations
 */

// eslint-disable-next-line sonarjs/cognitive-complexity
async function getActivitiesDates({ instances, assignations, filters, ctx }) {
  const { status, progress, isArchived, sort, studentDidOpen, studentCanSee, gradeWasViewed } =
    filters;

  if (!(status || progress || isArchived !== undefined || studentDidOpen !== undefined || sort)) {
    return {};
  }

  const instancesIds = map(instances || [], 'id');
  const assignationsIds = map(assignations || [], 'id');

  const instanceNames = [];
  const assignationNames = [];

  if (status || progress) {
    instanceNames.push('start', 'deadline', 'closed', 'visualization');

    if (progress) {
      assignationNames.push('start', 'end');
    }
  }

  if (studentDidOpen !== undefined) {
    assignationNames.push('open');
  }

  if (gradeWasViewed) {
    assignationNames.push('gradesViewed');
  }

  if (isArchived !== undefined) {
    instanceNames.push('archived');
  }

  if (['start', 'deadline'].includes(sort)) {
    instanceNames.push('start', 'deadline');
  }

  if (studentCanSee) {
    instanceNames.push('visualization', 'start');
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
