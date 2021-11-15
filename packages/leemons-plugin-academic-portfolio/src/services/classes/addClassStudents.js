const _ = require('lodash');
const { table } = require('../tables');
const { validateAddClassStudents } = require('../../validations/forms');
const { classByIds } = require('./classByIds');
const { add: addStudent } = require('./student/add');

async function addClassStudents(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddClassStudents(data, { transacting });

      const getClass = async () => (await classByIds(data.class, { transacting }))[0];

      const _class = await getClass();

      const promises = [];
      _.forEach(data.students, (student) => {
        if (_class.students.indexOf(student) < 0)
          promises.push(addStudent(data.class, student, { transacting }));
      });

      await Promise.all(promises);

      return getClass();
    },
    table.groups,
    _transacting
  );
}

module.exports = { addClassStudents };
