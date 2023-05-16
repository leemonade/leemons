const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateGradeScale } = require('../../validations/forms');

async function updateGradeScale(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateGradeScale(data, { transacting });
      const { id, ..._data } = data;
      return table.gradeScales.update({ id }, _data, { transacting });
    },
    table.grades,
    _transacting
  );
}

module.exports = { updateGradeScale };
