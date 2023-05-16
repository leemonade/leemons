const _ = require('lodash');
const { table } = require('../tables');
const { validateAddClassTeachers } = require('../../validations/forms');
const { classByIds } = require('./classByIds');
const { add: addTeacher } = require('./teacher/add');

async function addClassTeachers(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddClassTeachers(data, { transacting });

      const getClass = async () => (await classByIds(data.class, { transacting }))[0];

      const _class = await getClass();

      const hasMainTeacher = !!_.find(_class.teachers, { type: 'main-teacher' });
      const newHasMainTeacher = !!_.find(data.teachers, { type: 'main-teacher' });

      if (hasMainTeacher && newHasMainTeacher) {
        throw new Error('The class already has a lead teacher');
      }

      const classTeacherIds = _.map(_class.teachers, 'teacher');

      const promises = [];
      _.forEach(data.teachers, ({ teacher, type }) => {
        if (classTeacherIds.indexOf(teacher) < 0)
          promises.push(addTeacher(data.class, teacher, type, { transacting }));
      });

      await Promise.all(promises);

      return getClass();
    },
    table.groups,
    _transacting
  );
}

module.exports = { addClassTeachers };
