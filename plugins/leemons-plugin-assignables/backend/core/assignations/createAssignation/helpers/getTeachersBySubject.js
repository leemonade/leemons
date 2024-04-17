const { isString } = require('lodash');
const { uniq } = require('lodash');

function getTeachersBySubject({ classesData }) {
  const teachersBySubject = {};
  classesData.forEach(({ subject: { id: subjectId }, teachers }) => {
    const previousTeachers = teachersBySubject[subjectId] || [];

    teachersBySubject[subjectId] = previousTeachers.concat(
      teachers.map(({ teacher }) => (isString(teacher) ? teacher : teacher.id))
    );
  });

  return Object.fromEntries(
    Object.entries(teachersBySubject).map(([subjectId, teachers]) => [subjectId, uniq(teachers)])
  );
}

module.exports = { getTeachersBySubject };
