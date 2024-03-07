const { getProgramCourses } = require('./getProgramCourses');

async function programCanHaveCoursesOrHaveCourses({ id, ctx }) {
  const program = await ctx.tx.db.Programs.findOne({ id })
    .select(['id', 'maxNumberOfCourses'])
    .lean();
  if (program.maxNumberOfCourses > 1) {
    return true;
  }

  const courses = await getProgramCourses({ id, ctx });
  if (courses.length > 1) {
    return true;
  }
  return false;
}

module.exports = { programCanHaveCoursesOrHaveCourses };
