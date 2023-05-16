const _ = require('lodash');
const { table } = require('../tables');

async function getGradeScalesByGrade(grade, { transacting } = {}) {
  return table.gradeScales.find({ grade_$in: _.isArray(grade) ? grade : [grade] }, { transacting });
}

module.exports = { getGradeScalesByGrade };
