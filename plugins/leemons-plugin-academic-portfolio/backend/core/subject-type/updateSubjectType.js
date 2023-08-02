const { table } = require('../tables');
const { validateUpdateSubjectType } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateSubjectType(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateSubjectType(data, { transacting });
      const { id, managers, ..._data } = data;
      const [subjectType] = await Promise.all([
        table.subjectTypes.update({ id }, _data, { transacting }),
        saveManagers(managers, 'subject-type', id, { transacting }),
      ]);
      return subjectType;
    },
    table.subjectTypes,
    _transacting
  );
}

module.exports = { updateSubjectType };
