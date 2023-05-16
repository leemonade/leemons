const _ = require('lodash');
const { table } = require('../tables');
const { getGradeTagsByIds } = require('./getGradeTagsByIds');

async function getGradeTagsByGrade(grade, { transacting } = {}) {
  const tags = await table.gradeTags.find(
    { grade_$in: _.isArray(grade) ? grade : [grade] },
    { columns: ['id'], transacting }
  );

  return getGradeTagsByIds(_.map(tags, 'id'), { transacting });
}

module.exports = { getGradeTagsByGrade };
