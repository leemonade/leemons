const _ = require('lodash');

async function getClassesUnderProgramCourse({ program, course, ctx }) {
  const programs = _.isArray(program) ? program : [program];
  // eslint-disable-next-line no-nested-ternary
  const courses = course ? (_.isArray(course) ? course : [course]) : null;
  const classes = await ctx.tx.db.Class.find({ program: programs }).select(['id']).lean();
  const classIds = _.map(classes, 'id');
  const classCourses = await ctx.tx.db.ClassCourse.find({
    class: classIds,
    course: courses,
  })
    .select(['class'])
    .lean();
  return _.map(classCourses, 'class');
}

module.exports = { getClassesUnderProgramCourse };
