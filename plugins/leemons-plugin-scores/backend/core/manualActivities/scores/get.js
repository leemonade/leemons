async function getScores({ classId, ctx }) {
  const scores = await ctx.tx.db.ManualActivityScores.find({ class: classId }).lean();

  const response = {};

  scores.forEach((score) => {
    if (!response[score.activity]) {
      response[score.activity] = {};
    }

    response[score.activity][score.user] = score;
  });

  return response;
}

module.exports = getScores;
