const _ = require('lodash');
const { table } = require('../tables');
const { conditionsInGradeScale } = require('../conditions/conditionsInGradeScale');
const { gradeTagsInGradeScale } = require('../grade-tags/gradeTagsInGradeScale');

async function removeGradeScale(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const nConditionsInGradeScale = await conditionsInGradeScale(id, { transacting });
      if (nConditionsInGradeScale)
        throw new global.utils.HttpErrorWithCustomCode(
          400,
          6002,
          'Cannot delete grade scale because it is used in conditions'
        );

      const nGradeTagsInGradeScale = await gradeTagsInGradeScale(id, { transacting });
      if (nGradeTagsInGradeScale)
        throw new global.utils.HttpErrorWithCustomCode(
          400,
          6003,
          'Cannot delete grade scale because it is used in grade tags'
        );

      await table.gradeScales.delete({ id }, { transacting });

      return true;
    },
    table.grades,
    _transacting
  );
}

module.exports = { removeGradeScale };
