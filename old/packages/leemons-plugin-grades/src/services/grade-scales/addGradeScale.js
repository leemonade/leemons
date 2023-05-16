const _ = require('lodash');
const { table } = require('../tables');
const { validateAddGradeScale } = require('../../validations/forms');

async function addGradeScale(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddGradeScale(data, { transacting });
      return table.gradeScales.create(data, { transacting });
    },
    table.grades,
    _transacting
  );
}

module.exports = { addGradeScale };
