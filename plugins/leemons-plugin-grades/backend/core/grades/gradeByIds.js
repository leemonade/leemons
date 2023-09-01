const _ = require('lodash');
const { getGradeScalesByGrade } = require('../grade-scales/getGradeScalesByGrade');
const { getGradeTagsByGrade } = require('../grade-tags/getGradeTagsByGrade');

async function gradeByIds({ ids, ctx }) {
  const [grades, gradeScales, gradeTags] = await Promise.all([
    ctx.tx.db.Grades.find({ id: _.isArray(ids) ? ids : [ids] }).lean(),
    getGradeScalesByGrade({ grade: ids, ctx }),
    getGradeTagsByGrade({ grade: ids, ctx }),
  ]);

  const gradeScalesByGrade = _.groupBy(gradeScales, 'grade');
  const gradeTagsByGrade = _.groupBy(gradeTags, 'grade');

  return _.map(grades, (grade) => {
    let scales = gradeScalesByGrade[grade.id] || [];
    scales = _.orderBy(scales, 'order', 'asc');
    return {
      ...grade,
      scales,
      tags: gradeTagsByGrade[grade.id] || [],
    };
  });
}

module.exports = { gradeByIds };
