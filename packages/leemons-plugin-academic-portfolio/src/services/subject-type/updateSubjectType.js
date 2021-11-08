const { table } = require('../tables');
const { validateUpdateSubjectType } = require('../../validations/forms');

async function updateSubjectType(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateSubjectType(data, { transacting });
      const { id, ..._data } = data;
      return table.subjectTypes.update({ id }, _data, { transacting });
    },
    table.subjectTypes,
    _transacting
  );
}

module.exports = { updateSubjectType };
