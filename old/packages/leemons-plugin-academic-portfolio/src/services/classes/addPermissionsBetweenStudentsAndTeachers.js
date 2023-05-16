const { map } = require('lodash');
const { table } = require('../tables');

async function addPermissionsBetweenStudentsAndTeachers(
  classId,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const [students, teachers] = await Promise.all([
        table.classStudent.find({ class: classId }, { transacting }),
        table.classTeacher.find({ class: classId }, { transacting }),
      ]);

      const studentsIds = map(students, 'student');
      const teachersIds = map(teachers, 'teacher');
      const allIds = studentsIds.concat(teachersIds);

      const { addUserAgentContacts } = leemons.getPlugin('users').services.users;
      return addUserAgentContacts(allIds, allIds, { target: classId, transacting });
    },
    table.classStudent,
    _transacting
  );
}

module.exports = { addPermissionsBetweenStudentsAndTeachers };
