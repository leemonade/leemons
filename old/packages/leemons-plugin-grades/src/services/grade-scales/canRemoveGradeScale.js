const _ = require('lodash');
const { table } = require('../tables');
const { conditionsInGradeScale } = require('../conditions/conditionsInGradeScale');
const { gradeTagsInGradeScale } = require('../grade-tags/gradeTagsInGradeScale');
const { gradesInGradeScale } = require('../grades/gradesInGradeScale');

async function canRemoveGradeScale(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const gradeScaleIds = _.isArray(id) ? id : [id];

      const nConditionsInGradeScale = await conditionsInGradeScale(gradeScaleIds, { transacting });
      if (nConditionsInGradeScale)
        throw new global.utils.HttpErrorWithCustomCode(
          400,
          6002,
          'Cannot delete grade scale because it is used in conditions'
        );

      const nGradeTagsInGradeScale = await gradeTagsInGradeScale(gradeScaleIds, { transacting });
      if (nGradeTagsInGradeScale)
        throw new global.utils.HttpErrorWithCustomCode(
          400,
          6003,
          'Cannot delete grade scale because it is used in grade tags'
        );

      const nGradesInGradeScale = await gradesInGradeScale(gradeScaleIds, { transacting });
      if (nGradesInGradeScale)
        throw new global.utils.HttpErrorWithCustomCode(
          400,
          6004,
          'Cannot delete grade scale because it is used in grades'
        );

      return true;
    },
    table.grades,
    _transacting
  );
}

module.exports = { canRemoveGradeScale };
