const { table } = require('../tables');
const { validateUpdateSubject } = require('../../validations/forms');

async function updateSubject(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateSubject(data, { transacting });
      const { id, ..._data } = data;
      return table.subjects.update({ id }, _data, { transacting });
    },
    table.subjects,
    _transacting
  );
}

module.exports = { updateSubject };
