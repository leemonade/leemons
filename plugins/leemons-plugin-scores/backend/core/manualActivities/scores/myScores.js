const { keyBy } = require('lodash');

async function getMyScores({ classId, ctx }) {
  const user = ctx.meta.userSession.userAgents[0].id;
  const scores = await ctx.tx.db.ManualActivityScores.find({ class: classId, user }).lean();

  return keyBy(scores, 'activity');
}

module.exports = getMyScores;
