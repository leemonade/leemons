const _ = require('lodash');
const { table } = require('../tables');
const { validateAddGrade } = require('../../validations/forms');
const { addGradeScale } = require('../grade-scales');
const { gradeByIds } = require('./gradeByIds');

async function addGrade(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddGrade(data);

      const { scales, minScaleToPromote, ..._data } = data;

      const grade = await table.grades.create(_data, { transacting });

      const newScales = await Promise.all(
        _.map(scales, (scale) => addGradeScale({ ...scale, grade: grade.id }, { transacting }))
      );

      const minScale = _.find(newScales, { number: minScaleToPromote });
      if (!minScale) throw new Error('minScaleToPromote not found inside scales');

      await table.grades.update(
        { id: grade.id },
        { minScaleToPromote: minScale.id },
        { transacting }
      );

      return (await gradeByIds(grade.id, { transacting }))[0];
    },
    table.grades,
    _transacting
  );
}

module.exports = { addGrade };
