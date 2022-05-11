const _ = require('lodash');
const { teachers: table } = require('../tables');

module.exports = async function getAssignableInstancesFromTeacher(
  teacherIds,
  { transacting } = {}
) {
  const query = Array.isArray(teacherIds) ? { teacher_$in: teacherIds } : { teacher: teacherIds };
  const teacherRelations = await table.find(query, {
    transacting,
    columns: ['assignableInstance', 'type'],
  });

  const assignableInstances = _.uniqBy(teacherRelations, 'assignableInstance');

  return assignableInstances.map(({ assignableInstance, type }) => ({
    id: assignableInstance,
    type,
  }));
};
