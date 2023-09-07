const _ = require('lodash');
const { conditionsInGradeScale } = require('../conditions/conditionsInGradeScale');
const { gradeTagsInGradeScale } = require('../grade-tags/gradeTagsInGradeScale');
const { gradesInGradeScale } = require('../grades/gradesInGradeScale');
const { LeemonsError } = require('leemons-error');

// Explain me this code
async function canRemoveGradeScale({ id, ctx }) {
  const gradeScaleIds = _.isArray(id) ? id : [id];

  const nConditionsInGradeScale = await conditionsInGradeScale({ gradeScale: gradeScaleIds, ctx });
  if (nConditionsInGradeScale)
    throw new LeemonsError(ctx, {
      httpStatusCode: 400,
      customCode: 6002,
      message: 'Cannot delete grade scale because it is used in conditions',
    });

  const nGradeTagsInGradeScale = await gradeTagsInGradeScale({ gradeScale: gradeScaleIds, ctx });
  if (nGradeTagsInGradeScale)
    throw new LeemonsError(ctx, {
      httpStatusCode: 400,
      customCode: 6003,
      message: 'Cannot delete grade scale because it is used in grade tags',
    });

  const nGradesInGradeScale = await gradesInGradeScale({ gradeScale: gradeScaleIds, ctx });
  if (nGradesInGradeScale)
    throw new LeemonsError(ctx, {
      httpStatusCode: 400,
      customCode: 6004,
      message: 'Cannot delete grade scale because it is used in grades',
    });

  return true;
}

module.exports = { canRemoveGradeScale };
