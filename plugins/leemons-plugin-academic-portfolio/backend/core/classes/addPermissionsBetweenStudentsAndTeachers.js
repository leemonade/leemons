const { map } = require('lodash');

async function addPermissionsBetweenStudentsAndTeachers({ classId, ctx }) {
  const [students, teachers] = await Promise.all([
    ctx.tx.db.ClassStudent.find({ class: classId }).lean(),
    ctx.tx.db.ClassTeacher.find({ class: classId }).lean(),
  ]);

  const studentsIds = map(students, 'student');
  const teachersIds = map(teachers, 'teacher');
  const allIds = studentsIds.concat(teachersIds);

  return ctx.tx.call('users.users.addUserAgentContacts', {
    fromUserAgent: allIds,
    toUserAgent: allIds,
    target: classId,
  });
}

module.exports = { addPermissionsBetweenStudentsAndTeachers };
