const _ = require('lodash');

async function removeCourseByIds({ ids, soft, ctx }) {
  const courses = await ctx.tx.db.Groups.find({
    id: _.isArray(ids) ? ids : [ids],
    type: 'course',
  }).lean();
  await ctx.tx.emit('before-remove-courses', { courses, soft });
  await ctx.tx.db.Groups.deleteMany({ id: _.map(courses, 'id') }, { soft });
  await ctx.tx.emit('after-remove-courses', { courses, soft });
  return true;
}

module.exports = { removeCourseByIds };
