const _ = require('lodash');

async function getTeachersBySubjects({ subjectId, type, returnBySubject, ctx }) {
  const classes = await ctx.tx.db.Class.find({
    subject: _.isArray(subjectId) ? subjectId : [subjectId],
  })
    .select(['id', 'subject'])
    .lean();

  const classesBySubject = _.groupBy(classes, 'subject');

  const query = {
    class: _.map(classes, 'id'),
  };

  if (type) {
    query.type = type;
  }

  const classTeachers = await ctx.tx.db.ClassTeacher.find(query)
    .select(['teacher', 'type', 'class'])
    .lean();

  if (returnBySubject) {
    const response = {};
    _.forIn(classesBySubject, (value, key) => {
      if (!response[key]) {
        response[key] = [];
      }
      const classIds = _.map(value, 'id');
      response[key] = response[key].concat(
        _.filter(classTeachers, ({ class: c }) => classIds.includes(c))
      );
    });
    return response;
  }
  return classTeachers;
}

module.exports = { getTeachersBySubjects };
