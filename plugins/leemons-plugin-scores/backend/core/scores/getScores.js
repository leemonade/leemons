const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

module.exports = async function getScores({
  students,
  classes,
  instances,
  periods,
  published,
  gradedBy,
  ctx,
}) {
  // TODO: Verify it can be deleted by this user

  const query = {};

  if (students?.length) {
    query.student = students;
  }
  if (classes?.length) {
    query.class = classes;
  }
  if (instances?.length) {
    query.instance = instances;
  }
  if (periods?.length) {
    query.period = periods;
  }
  if (gradedBy?.length) {
    query.gradedBy = gradedBy;
  }
  if (published !== undefined) {
    query.published = published;
  }

  if (!Object.keys(_.omit(query, ['published'])).length) {
    throw new LeemonsError(ctx, {
      message: `Error getting scores: at least one of: students, classes, instances, periods or gradedBy is required`,
    });
  }

  const scoresFound = await ctx.tx.db.Scores.find(query).lean();

  return scoresFound.map((score) => ({ ...score, grade: parseFloat(score.grade) }));
};
