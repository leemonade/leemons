const _ = require('lodash');
const { table } = require('../tables');

async function gradeTagsInGradeScale(gradeScale, { transacting } = {}) {
  return table.gradeTags.count(
    { scale_$in: _.isArray(gradeScale) ? gradeScale : [gradeScale] },
    { transacting }
  );
}

module.exports = { gradeTagsInGradeScale };
