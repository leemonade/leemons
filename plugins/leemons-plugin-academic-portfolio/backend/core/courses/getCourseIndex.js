const { isString } = require('lodash');

async function getCourseIndex({ course, getMultiple, ctx }) {
  if (!getMultiple && isString(course)) {
    const { index } = await ctx.tx.db.Groups.find({ id: course, type: 'course' });
    return index;
  }

  const courses = await ctx.tx.db.Groups.find({ id: course, type: 'course' })
    .select(['id', 'index'])
    .lean();
  return courses.map((_course) => _course.index).join(':');
}

module.exports = { getCourseIndex };
