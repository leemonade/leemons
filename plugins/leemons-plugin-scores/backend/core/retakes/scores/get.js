async function getRetakeScores({ retakeId, retakeIndex, class: classId, period, user, ctx }) {
  const query = {
    class: classId,
    period,
  };

  if (user) {
    query.user = user; // It can be an array of users
  }

  if (retakeId) {
    query.retakeId = retakeId;
  }

  if (retakeIndex) {
    query.retakeIndex = retakeIndex;
  }

  const scores = await ctx.tx.db.RetakeScores.find(query)
    .sort({ retakeIndex: 1 })
    .select({ _id: 0, __v: 0 })
    .lean();

  const response = {};

  scores.forEach((score) => {
    if (!response[score.user]) {
      response[score.user] = [];
    }

    response[score.user].push(score);
  });

  return response;
}

module.exports = getRetakeScores;
