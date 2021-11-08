const { table } = require('../tables');
const { validateUpdateCourse } = require('../../validations/forms');

async function updateCourse(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateCourse(data, { transacting });
      const { id, ..._data } = data;
      return table.groups.update({ id }, { ..._data }, { transacting });
    },
    table.groups,
    _transacting
  );
}

module.exports = { updateCourse };
