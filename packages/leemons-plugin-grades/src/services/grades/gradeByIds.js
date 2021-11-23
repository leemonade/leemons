const _ = require('lodash');
const { table } = require('../tables');
const { getGradeScalesByGrade } = require('../grade-scales/getGradeScalesByGrade');
const { getGradeTagsByGrade } = require('../grade-tags/getGradeTagsByGrade');

async function gradeByIds(ids, { transacting } = {}) {
  const [grades, gradeScales, gradeTags] = await Promise.all([
    table.grades.find({ id_$in: ids }, { transacting }),
    getGradeScalesByGrade(ids, { transacting }),
    getGradeTagsByGrade(ids, { transacting }),
  ]);

  const gradeScalesByGrade = _.groupBy(gradeScales, 'grade');
  const gradeTagsByGrade = _.groupBy(gradeTags, 'grade');

  return _.map(grades, (grade) => ({
    ...grade,
    scales: gradeScalesByGrade[grade.id] || [],
    tags: gradeTagsByGrade[grade.id] || [],
  }));
}

module.exports = { gradeByIds };
