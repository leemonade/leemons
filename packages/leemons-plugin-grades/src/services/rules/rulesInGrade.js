const _ = require('lodash');
const { table } = require('../tables');

async function rulesInGrade(grade, { transacting } = {}) {
  return table.rules.count({ grade_$in: _.isArray(grade) ? grade : [grade] }, { transacting });
}

module.exports = { rulesInGrade };
