const _ = require('lodash');
const { table } = require('../tables');
const { rulesInGrade } = require('../rules/rulesInGrade');
const { removeGradeTagsByGrade } = require('../grade-tags/removeGradeTagsByGrade');
const { removeGradeScaleByGrade } = require('../grade-scales/removeGradeScaleByGrade');

async function removeGrade(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const nRulesInGrade = await rulesInGrade(id, { transacting });
      if (nRulesInGrade)
        throw new global.utils.HttpErrorWithCustomCode(400, 6001, 'Cannot remove grade with rules');

      const grades = await table.grades.find(
        { id_$in: _.isArray(id) ? id : [id] },
        { transacting }
      );
      const gradeIds = _.map(grades, 'id');

      await leemons.events.emit('before-remove-grades', { grades, transacting });

      await table.grades.update({ id_$in: gradeIds }, { minScaleToPromote: null }, { transacting });

      await removeGradeTagsByGrade(gradeIds, { transacting });
      await removeGradeScaleByGrade(gradeIds, { transacting });

      await table.grades.delete({ id_$in: gradeIds }, { transacting });

      await leemons.events.emit('after-remove-grades', { grades, transacting });

      return true;
    },
    table.grades,
    _transacting
  );
}

module.exports = { removeGrade };
