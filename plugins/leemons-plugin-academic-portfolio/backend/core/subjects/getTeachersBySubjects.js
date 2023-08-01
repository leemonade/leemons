const _ = require('lodash');
const { table } = require('../tables');

async function getTeachersBySubjects(
  subjectId,
  { type, returnBySubject, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classes = await table.class.find(
        { subject_$in: _.isArray(subjectId) ? subjectId : [subjectId] },
        { columns: ['id', 'subject'], transacting }
      );

      const classesBySubject = _.groupBy(classes, 'subject');

      const query = {
        class_$in: _.map(classes, 'id'),
      };

      if (type) {
        query.type = type;
      }

      const classTeachers = await table.classTeacher.find(query, {
        columns: ['teacher', 'type', 'class'],
        transacting,
      });

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
    },
    table.class,
    _transacting
  );
}

module.exports = { getTeachersBySubjects };
