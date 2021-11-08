const { table } = require('../tables');
const { validateAddSubjectType } = require('../../validations/forms');

async function addSubjectType(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddSubjectType(data, { transacting });
      return table.subjectTypes.create(data, { transacting });
    },
    table.subjectTypes,
    _transacting
  );
}

module.exports = { addSubjectType };
