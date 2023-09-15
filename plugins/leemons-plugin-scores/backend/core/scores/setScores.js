const { sqlDatetime } = require('@leemons/utils');
const removeScores = require('./removeScores');

function removeScoresQuery(scores) {
  return scores.reduce(
    (acc, score) => ({
      students: score.student ? [...acc.students, score.student] : acc.students,
      classes: score.class ? [...acc.classes, score.class] : acc.classes,
      instances: score.instance ? [...acc.instances, score.instance] : acc.instances,
      periods: score.period ? [...acc.periods, `${score.period}`] : acc.periods,
    }),
    {
      students: [],
      classes: [],
      instances: [],
      periods: [],
    }
  );
}

module.exports = async function setScores({ scores, ctx }) {
  await removeScores({ ...removeScoresQuery(scores), ctx });
  // TODO: Verify userSession is allowed to save scores (already published or not)
  await ctx.tx.db.Scores.insertMany(
    scores.map((score) => ({
      ...score,
      period: `${score.period}`,
      gradedAt: sqlDatetime(new Date()),
    }))
  );

  return true;
};
