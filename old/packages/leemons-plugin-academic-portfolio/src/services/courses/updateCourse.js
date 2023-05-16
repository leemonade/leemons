const { table } = require('../tables');
const { validateUpdateCourse } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateCourse(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateCourse(data, { transacting });
      const { id, managers, ..._data } = data;
      const [group] = await Promise.all([
        table.groups.update({ id }, _data, { transacting }),
        saveManagers(managers, 'course', id, { transacting }),
      ]);
      return group;
    },
    table.groups,
    _transacting
  );
}

module.exports = { updateCourse };
