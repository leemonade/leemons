/* eslint-disable no-nested-ternary */
const _ = require('lodash');

async function getUsersInProgram({ program, course, onlyStudents, onlyTeachers, ctx }) {
  const programs = _.isArray(program) ? program : [program];
  const courses = course ? (_.isArray(course) ? course : [course]) : null;
  const classes = await ctx.tx.db.Class.find({ program: programs }).select(['id']).lean();
  let classIds = _.map(classes, 'id');
  if (courses) {
    const classCourses = await ctx.tx.ClassCourse.find({
      class: classIds,
      course: courses,
    })
      .select(['class'])
      .lean();
    classIds = _.map(classCourses, 'class');
  }
  const [students, teachers] = await Promise.all([
    ctx.tx.db.ClassStudent.find({ class: classIds }).select(['student']).lean(),
    ctx.tx.db.ClassTeacher.find({ class: classIds }).select(['teacher']).lean(),
  ]);

  if (onlyStudents) return _.uniq(_.map(students, 'student'));
  if (onlyTeachers) return _.uniq(_.map(teachers, 'teacher'));

  return _.uniq(_.map(students, 'student').concat(_.map(teachers, 'teacher')));
}

module.exports = { getUsersInProgram };
