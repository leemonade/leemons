const _ = require('lodash');
const { table } = require('../tables');

async function conditionsInGradeScale(gradeScale, { transacting } = {}) {
  return table.conditions.count(
    { targetGradeScale_$in: _.isArray(gradeScale) ? gradeScale : [gradeScale] },
    { transacting }
  );
}

module.exports = { conditionsInGradeScale };
