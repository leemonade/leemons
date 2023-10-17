const _ = require('lodash');

module.exports = async function getAssignableInstancesFromTeacher({ teacherIds, ctx }) {
  const query = { teacher: teacherIds };
  const teacherRelations = await ctx.tx.db.Teachers.find(query)
    .select(['assignableInstance', 'type'])
    .lean();

  const assignableInstances = _.uniqBy(teacherRelations, 'assignableInstance');

  return assignableInstances.map(({ assignableInstance, type }) => ({
    id: assignableInstance,
    type,
  }));
};
