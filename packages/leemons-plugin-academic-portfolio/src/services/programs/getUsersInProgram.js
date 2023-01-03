/* eslint-disable no-nested-ternary */
const _ = require('lodash');
const { table } = require('../tables');

async function getUsersInProgram(
  program,
  { course, transacting, onlyStudents, onlyTeachers } = {}
) {
  const programs = _.isArray(program) ? program : [program];
  const courses = course ? (_.isArray(course) ? course : [course]) : null;
  const classes = await table.class.find(
    { program_$in: programs },
    { columns: ['id'], transacting }
  );
  let classIds = _.map(classes, 'id');
  if (courses) {
    const classCourses = await table.classCourse.find(
      {
        class_$in: classIds,
        course_$in: courses,
      },
      { columns: ['class'], transacting }
    );
    classIds = _.map(classCourses, 'class');
  }
  const [students, teachers] = await Promise.all([
    table.classStudent.find({ class_$in: classIds }, { columns: ['student'], transacting }),
    table.classTeacher.find({ class_$in: classIds }, { columns: ['teacher'], transacting }),
  ]);

  if (onlyStudents) return _.uniq(_.map(students, 'student'));
  if (onlyTeachers) return _.uniq(_.map(teachers, 'teacher'));

  return _.uniq(_.map(students, 'student').concat(_.map(teachers, 'teacher')));
}

module.exports = { getUsersInProgram };
