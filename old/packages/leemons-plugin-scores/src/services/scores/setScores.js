const { scores: scoresTable } = require('../tables');
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

module.exports = async function setScores(scores, { userSession, transacting } = {}) {
  await removeScores(removeScoresQuery(scores), { userSession, transacting });
  // TODO: Verify userSession is allowed to save scores (already published or not)
  await scoresTable.createMany(
    scores.map((score) => ({
      ...score,
      period: `${score.period}`,
      gradedAt: global.utils.sqlDatetime(new Date()),
    })),
    { transacting }
  );

  return true;
};
