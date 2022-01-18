const _ = require('lodash');
const { table } = require('../tables');
const { conditionsInGradeScale } = require('../conditions/conditionsInGradeScale');
const { gradeTagsInGradeScale } = require('../grade-tags/gradeTagsInGradeScale');
const { gradesInGradeScale } = require('../grades/gradesInGradeScale');

async function removeGradeScale(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const gradeScales = await table.gradeScales.find(
        { id_$in: _.isArray(id) ? id : [id] },
        { transacting }
      );

      const gradeScaleIds = _.map(gradeScales, 'id');

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

      await leemons.events.emit('before-remove-grade-scales', { gradeScales, transacting });

      await table.gradeScales.delete({ id_$in: gradeScaleIds }, { transacting });

      await leemons.events.emit('after-remove-grade-scales', { gradeScales, transacting });

      return true;
    },
    table.grades,
    _transacting
  );
}

module.exports = { removeGradeScale };
