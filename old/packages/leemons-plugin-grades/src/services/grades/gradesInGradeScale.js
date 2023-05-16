const _ = require('lodash');
const { table } = require('../tables');

async function gradesInGradeScale(gradeScale, { transacting } = {}) {
  return table.grades.count(
    { minScaleToPromote_$in: _.isArray(gradeScale) ? gradeScale : [gradeScale] },
    { transacting }
  );
}

module.exports = { gradesInGradeScale };
