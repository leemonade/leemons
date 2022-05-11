const addPermissionToUser = require('../assignableInstance/permissions/assignableInstance/users/addPermissionToUser');
const { teachers: table } = require('../tables');

module.exports = async function addTeachersToAssignableInstance(
  teachers,
  { id: assignableInstanceId, assignable: assignableId },
  { transacting } = {}
) {
  const teachersIds = teachers.map(({ id }) => id);
  await addPermissionToUser(assignableInstanceId, assignableId, teachersIds, 'teacher', {
    transacting,
  });

  // EN: Save the teachers
  // ES: Guarda los profesores
  return table.createMany(
    teachers.map(({ teacher, type }) => ({
      assignableInstance: assignableInstanceId,
      teacher,
      type,
    })),
    {
      transacting,
    }
  );
};
