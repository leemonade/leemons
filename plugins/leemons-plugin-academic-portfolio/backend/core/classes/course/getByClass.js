const _ = require('lodash');

async function getByClass({ returnCourse, class: _class, showArchived, ctx }) {
  const queryOptions = showArchived ? { excludeDeleted: false } : {};
  const classCourses = await ctx.tx.db.ClassCourse.find(
    {
      class: _.isArray(_class) ? _class : [_class],
    },
    '',
    queryOptions
  ).lean();
  if (returnCourse) return _.map(classCourses, 'course');
  return classCourses;
}

module.exports = { getByClass };
