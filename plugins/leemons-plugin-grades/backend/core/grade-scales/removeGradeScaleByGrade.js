const _ = require('lodash');
const { table } = require('../tables');

async function removeGradeScaleByGrade(grade, { transacting } = {}) {
  const gradeScales = await table.gradeScales.find(
    { grade_$in: _.isArray(grade) ? grade : [grade] },
    { transacting }
  );

  const gradeScaleIds = _.map(gradeScales, 'id');

  await leemons.events.emit('before-remove-grade-scales', { gradeScales, transacting });

  await table.gradeScales.deleteMany({ id_$in: gradeScaleIds }, { transacting });

  await leemons.events.emit('after-remove-grade-scales', { gradeScales, transacting });

  return true;
}

module.exports = { removeGradeScaleByGrade };
