const _ = require('lodash');
const { table } = require('../tables');
const { remove: removeStudent } = require('../classes/student/remove');
const { remove: removeTeacher } = require('../classes/teacher/remove');

async function onDisableUserAgents({ ids, transacting: _transacting }) {
  return global.utils.withTransaction(
    async (transacting) => {
      const [classStudents, classTeachers] = await Promise.all([
        table.classStudent.find({ student_$in: ids }, { transacting }),
        table.classTeacher.find({ teacher_$in: ids }, { transacting }),
      ]);
      await Promise.allSettled(
        _.map(classStudents, (classStudent) =>
          removeStudent(classStudent.class, classStudent.student, { transacting })
        )
      );
      await Promise.allSettled(
        _.map(classTeachers, (classTeacher) =>
          removeTeacher(classTeacher.class, classTeacher.teacher, { transacting })
        )
      );
    },
    table.classStudent,
    _transacting
  );
}

module.exports = { onDisableUserAgents };
