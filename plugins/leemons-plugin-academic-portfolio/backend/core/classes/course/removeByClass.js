const _ = require('lodash');

async function removeByClass({ classIds, soft, ctx }) {
  const classCourses = await ctx.tx.db.ClassCourse.find({
    class: _.isArray(classIds) ? classIds : [classIds],
  }).lean();
  // NOBODY LISTENS TO THIS EVENT
  await ctx.tx.emit('before-remove-classes-courses', {
    classCourses,
    soft,
  });
  await ctx.tx.db.ClassCourse.deleteMany({ id: _.map(classCourses, 'id') }, { soft });
  // NOBODY LISTENS TO THIS EVENT NEITHER
  await ctx.tx.emit('after-remove-classes-courses', {
    classCourses,
    soft,
  });
  return true;
}

module.exports = { removeByClass };
