const {
  removePermissionFromUser,
} = require('../permissions/instances/users/removePermissionFromUser');

async function removeTeachersFromAssignableInstance({ teachers, id, assignable, ctx }) {
  await removePermissionFromUser({
    assignableInstance: id,
    assignable,
    userAgents: teachers,
    role: 'teacher',
    ctx,
  });

  return ctx.tx.db.Teachers.deleteMany({ assignableInstance: id, teacher: { $in: teachers } });
}

module.exports = { removeTeachersFromAssignableInstance };
