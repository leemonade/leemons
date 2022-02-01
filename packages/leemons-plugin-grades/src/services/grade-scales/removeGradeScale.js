const _ = require('lodash');
const { table } = require('../tables');
const { conditionsInGradeScale } = require('../conditions/conditionsInGradeScale');
const { gradeTagsInGradeScale } = require('../grade-tags/gradeTagsInGradeScale');
const { gradesInGradeScale } = require('../grades/gradesInGradeScale');
const { canRemoveGradeScale } = require('./canRemoveGradeScale');

async function removeGradeScale(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const gradeScales = await table.gradeScales.find(
        { id_$in: _.isArray(id) ? id : [id] },
        { transacting }
      );

      const gradeScaleIds = _.map(gradeScales, 'id');

      await canRemoveGradeScale(gradeScaleIds, { transacting });

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
