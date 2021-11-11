const { table } = require('../tables');
const { validateAddCourse } = require('../../validations/forms');
const { getNextCourseIndex } = require('./getNextCourseIndex');
const { addNextCourseIndex } = require('./addNextCourseIndex');

async function addCourse(data, { index: _index, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddCourse(data, { transacting });
      let index = _index;
      if (!index) {
        index = await getNextCourseIndex(data.program, { transacting });
        await addNextCourseIndex(data.program, { index, transacting });
      }
      return table.groups.create({ ...data, index, type: 'course' }, { transacting });
    },
    table.groups,
    _transacting
  );
}

module.exports = { addCourse };
