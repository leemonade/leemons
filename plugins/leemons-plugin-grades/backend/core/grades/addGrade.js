const _ = require('lodash');
const { table } = require('../tables');
const { validateAddGrade } = require('../../validations/forms');
const { addGradeScale } = require('../grade-scales');
const { gradeByIds } = require('./gradeByIds');
const enableMenuItemService = require('../menu-builder/enableItem');

async function addGrade(data, { fromFrontend, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddGrade(data, fromFrontend);

      const { scales, minScaleToPromote, ..._data } = data;

      const grade = await table.grades.create(_data, { transacting });

      if (!fromFrontend) {
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
      }
      await Promise.all([
        enableMenuItemService('evaluations'),
        enableMenuItemService('promotions'),
      ]);
      return (await gradeByIds(grade.id, { transacting }))[0];
    },
    table.grades,
    _transacting
  );
}

module.exports = { addGrade };
