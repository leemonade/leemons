const _ = require('lodash');

async function getTeachersByClass({ class: _class, classe, type, returnIds, ctx }) {
  const __classes = _class || classe;
  const classes = _.isArray(__classes) ? __classes : [__classes];
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
