const { validateManualActivityScore } = require('../validations/validateManualActivityScore');

/**
 *
 * @param {object} props
 * @param {object[]} props.scores
 * @param {string} props.scores.user
 * @param {string} props.scores.activity,
 * @param {string} props.scores.grade
 * @param {string} props.scores.class
 * @param {string} props.ctx
 */
function setScores({ scores, ctx }) {
  const userAgentId = ctx.meta.userSession.userAgents[0].id;

  const scoresToSave = scores.map((score) => {
    validateManualActivityScore({ ctx, manualActivityScore: score });

    return {
      ...score,
      gradedBy: userAgentId,
    };
  });

  return Promise.all(
    scoresToSave.map((score) => {
      return ctx.tx.db.ManualActivityScores.updateOne(
        { user: score.user, activity: score.activity, class: score.class },
        { $set: { grade: score.grade, gradedBy: userAgentId } },
        { upsert: true }
      );
    })
  );
}

module.exports = setScores;
