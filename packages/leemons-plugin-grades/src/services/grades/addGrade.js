const _ = require('lodash');
const { table } = require('../tables');
const { validateAddGrade } = require('../../validations/forms');
const { addGradeScale } = require('../grade-scales');
const { gradeByIds } = require('./gradeByIds');

async function addGrade(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddGrade(data);

      const { scales, ..._data } = data;

      const grade = await table.grades.create(_data, { transacting });

      await Promise.all(
        _.map(scales, (scale) => addGradeScale({ ...scale, grade: grade.id }, { transacting }))
      );

      return (await gradeByIds(grade.id, { transacting }))[0];
    },
    table.grades,
    _transacting
  );
}

module.exports = { addGrade };
