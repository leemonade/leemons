const { map, uniq } = require('lodash');

async function getActivitiesByProfile({ ctx }) {
  const { userSession } = ctx.meta;
  const userAgents = userSession.userAgents.map((userAgent) => userAgent.id);

  const assignableInstancesAsTeacher = await ctx.tx.db.Teachers.find({
    teacher: userAgents,
  }).lean();

  if (assignableInstancesAsTeacher?.length) {
    return {
      assignableInstances: uniq(map(assignableInstancesAsTeacher, 'assignableInstance')),
      isTeacher: true,
    };
  }
  // TODO: Only get the needed properties
  const assignationsAsStudent = await ctx.tx.db.Assignations.find({ user: userAgents }).lean();

  if (assignationsAsStudent?.length) {
    return {
      assignations: assignationsAsStudent,
      isTeacher: false,
    };
  }

  return {
    assignableInstances: [],
  };
}

module.exports = { getActivitiesByProfile };
