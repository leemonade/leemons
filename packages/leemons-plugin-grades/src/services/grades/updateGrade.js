const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateGrade } = require('../../validations/forms');
const { gradeByIds } = require('./gradeByIds');

async function updateGrade(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateGrade(data);

      const { id, ..._data } = data;

      await table.grades.update({ id }, _data, { transacting });

      return (await gradeByIds(id, { transacting }))[0];
    },
    table.grades,
    _transacting
  );
}

module.exports = { updateGrade };
