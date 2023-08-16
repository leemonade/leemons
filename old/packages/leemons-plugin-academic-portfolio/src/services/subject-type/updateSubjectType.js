const { table } = require('../tables');
const { validateUpdateSubjectType } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateSubjectType(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateSubjectType(data, { transacting });
      const { id, managers, ..._data } = data;
      const promises = [table.subjectTypes.update({ id }, _data, { transacting })];
      if (managers) {
        promises.push(saveManagers(managers, 'subject-type', id, { transacting }));
      }
      const [subjectType] = await Promise.all(promises);
      return subjectType;
    },
    table.subjectTypes,
    _transacting
  );
}

module.exports = { updateSubjectType };
