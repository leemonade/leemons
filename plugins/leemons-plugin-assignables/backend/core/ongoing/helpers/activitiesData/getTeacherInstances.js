const { map } = require('lodash');
const { getInstancesData } = require('./getInstancesData');

async function getTeacherInstances({ ctx }) {
  const userAgents = ctx.meta.userSession?.userAgents.map((agent) => agent.id);

  const instancesTeached = await ctx.tx.db.Teachers.find({
    teacher: userAgents,
  })
    .select(['assignableInstance'])
    .lean();

  return Object.values(
    await getInstancesData({ instances: map(instancesTeached, 'assignableInstance'), ctx })
  );
}

module.exports = { getTeacherInstances };
