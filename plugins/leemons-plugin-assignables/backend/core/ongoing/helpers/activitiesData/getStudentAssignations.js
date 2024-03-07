const { map } = require('lodash');
const { getInstancesData } = require('./getInstancesData');

async function getStudentAssignations({ relatedInstances, ctx }) {
  const userAgents = ctx.meta.userSession?.userAgents.map((agent) => agent.id);
  const assignations = await ctx.tx.db.Assignations.find({
    user: userAgents,
  })
    .select(['id', 'instance', 'user'])
    .lean();

  const instancesIds = map(assignations, 'instance');

  const instancesData = await getInstancesData({ instances: instancesIds, relatedInstances, ctx });

  return assignations.map((assignation) => ({
    ...assignation,
    instance: instancesData[assignation.instance],
  }));
}

module.exports = { getStudentAssignations };
