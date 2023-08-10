const _ = require('lodash');

async function getTeachersByClass({ classe, type, returnIds, ctx }) {
  const classes = _.isArray(classe) ? classe : [classe];
  const query = {
    class: _.map(classes, (c) => (_.isString(c) ? c : c.id)),
  };

  if (type) {
    query.type = type;
  }

  const classTeachers = await ctx.tx.db.ClassTeacher.find(query)
    .select(['teacher', 'type', 'class'])
    .lean();

  return returnIds ? _.uniq(_.map(classTeachers, 'teacher')) : _.uniqBy(classTeachers, 'teacher');
}

module.exports = { getTeachersByClass };
