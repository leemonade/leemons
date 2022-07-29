const _ = require('lodash');
const { table } = require('../tables');

async function getTeachersByClass(classe, { type, returnIds, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classes = _.isArray(classe) ? classe : [classe];
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

      return returnIds ? _.map(classTeachers, 'teacher') : classTeachers;
    },
    table.class,
    _transacting
  );
}

module.exports = { getTeachersByClass };
