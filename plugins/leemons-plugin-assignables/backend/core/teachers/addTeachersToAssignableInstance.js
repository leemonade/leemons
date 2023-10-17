//! Solo está el encabezamiento para poder hacer test

const { addPermissionToUser } = require('../permissions/instances/users');

async function addTeachersToAssignableInstance({
  teachers,
  id: assignableInstanceId,
  assignable: assignableId,
  ctx,
}) {
  const teachersIds = teachers.map(({ id }) => id);
  await addPermissionToUser({
    assignableInstance: assignableInstanceId,
    assignable: assignableId,
    userAgents: teachersIds,
    role: 'teacher',
    ctx,
  });

  // EN: Save the teachers
  // ES: Guarda los profesores
  return ctx.tx.db.Teachers.insertMany(
    teachers.map(({ teacher, type }) => ({
      assignableInstance: assignableInstanceId,
      teacher,
      type,
    })),
    {
      new: true,
      lean: true,
    }
  );
}

module.exports = { addTeachersToAssignableInstance };
