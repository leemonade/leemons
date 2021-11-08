const { table } = require('../tables');
const { validateAddCourse } = require('../../validations/forms');

async function addCourse(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddCourse(data, { transacting });
      return table.groups.create({ ...data, type: 'course' }, { transacting });
    },
    table.groups,
    _transacting
  );
}

module.exports = { addCourse };
