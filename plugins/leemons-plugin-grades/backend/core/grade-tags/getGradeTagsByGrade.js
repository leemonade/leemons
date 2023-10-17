const _ = require('lodash');
const { getGradeTagsByIds } = require('./getGradeTagsByIds');

async function getGradeTagsByGrade({ grade, ctx }) {
  const tags = await ctx.tx.db.GradeTags.find({ grade: _.isArray(grade) ? grade : [grade] })
    .select(['id'])
    .lean();

  return getGradeTagsByIds({ ids: _.map(tags, 'id'), ctx });
}

module.exports = { getGradeTagsByGrade };
