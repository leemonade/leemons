const _ = require('lodash');

async function removeByClass({ classIds, soft, ctx }) {
  const classCourses = await ctx.tx.db.ClassCourse.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  await ctx.tx.emit('before-remove-classes-courses', {
    classCourses,
    soft,
  });
  await ctx.tx.db.ClassCourse.deleteMany({ id: _.map(classCourses, 'id') }, { soft });
  await ctx.tx.emit('after-remove-classes-courses', {
    classCourses,
    soft,
  });
  return true;
}

module.exports = { removeByClass };
