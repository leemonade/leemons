const { map } = require('lodash');
const { uniq } = require('lodash');
const { groupBy } = require('lodash');
const { minBy } = require('lodash');
const { maxBy } = require('lodash');

async function getModulesChildActivitiesIds({ assignations, ctx }) {
  const instancesIds = uniq(map(assignations, 'instance'));

  const instances = await ctx.tx.db.Instances.find({
    id: instancesIds,
    'metadata.module.type': 'module',
  })
    .select({
      'metadata.module': 1,
      id: 1,
      _id: 0,
    })
    .lean();

  return Object.fromEntries(
    instances.map((instance) => [instance.id, map(instance.metadata.module.activities, 'id')])
  );
}

async function getChildActivitiesData({ assignations, activitiesPerInstance, ctx }) {
  const childAssignationsQuery = assignations
    .filter((assignation) => activitiesPerInstance[assignation.instance])
    .flatMap((assignation) => {
      const { instance, user } = assignation;

      return activitiesPerInstance[instance].map((activity) => ({ instance: activity, user }));
    });

  if (!childAssignationsQuery.length) return {};

  return ctx.tx.db.Assignations.find({
    $or: childAssignationsQuery,
  })
    .select({ _id: false, id: true, user: true, instance: true })
    .lean();
}

async function getDatesByChildAssignation({ childAssignationsIds, childAssignationsById, ctx }) {
  const dates = await ctx.tx.db.Dates.find({
    type: 'assignation',
    instance: childAssignationsIds,
    name: ['start', 'end'],
  })
    .select({ _id: false, instance: 1, name: 1, date: 1 })
    .lean();

  const datesByChildAssignation = new Map();

  dates.forEach((date) => {
    const { instance: assignationId, name, date: value } = date;

    const { instance, user } = childAssignationsById[assignationId][0];

    const key = `instance.${instance}.user.${user}`;
    datesByChildAssignation.set(key, { ...datesByChildAssignation.get(key), [name]: value });
  });

  return datesByChildAssignation;
}

function returnData({ assignationsData, activitiesPerInstance, datesByChildAssignation }) {
  const datesData = {};
  const completion = {};

  assignationsData.forEach(({ instance, user, id }) => {
    const activities = activitiesPerInstance[instance];

    if (!activities) {
      return;
    }

    const dates = activities.map(
      (activity) => datesByChildAssignation.get(`instance.${activity}.user.${user}`) ?? {}
    );

    const startDate = minBy(dates, 'start')?.start ?? null;
    const endDate = maxBy(dates, 'end')?.end ?? null;

    const datesObj = {};

    if (startDate) {
      datesObj.start = startDate;
    }
    if (endDate) {
      datesObj.start = endDate;
    }

    completion[id] = {
      started: dates.filter((date) => date.start).length,
      completed: dates.filter((date) => date.end).length,
      total: activities.length,
    };
    datesData[id] = datesObj;
  });

  return { dates: datesData, completion };
}

async function getModuleActivitiesTimestamps({ assignationsData, ctx }) {
  const assignations = assignationsData.map(({ instance, user }) => ({ instance, user }));

  const activitiesPerInstance = await getModulesChildActivitiesIds({ assignations, ctx });
  const childAssignations = await getChildActivitiesData({
    assignations,
    activitiesPerInstance,
    ctx,
  });

  const childAssignationsById = groupBy(childAssignations, 'id');
  const childAssignationsIds = map(childAssignations, 'id');

  const datesByChildAssignation = await getDatesByChildAssignation({
    childAssignationsIds,
    childAssignationsById,
    ctx,
  });

  return returnData({ assignationsData, activitiesPerInstance, datesByChildAssignation });
}

module.exports = { getModuleActivitiesTimestamps };
