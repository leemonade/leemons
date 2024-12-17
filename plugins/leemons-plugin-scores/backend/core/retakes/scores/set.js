const { LeemonsError } = require('@leemons/error');

const validateRetakeScore = require('../validations/validateRetakeScore');

async function validateRetakeReference({
  retakeScore: { class: classId, period, retakeIndex: index, retakeId: id },
  ctx,
}) {
  if (!id && index !== 0) {
    return false;
  }

  const exists = await ctx.tx.db.Retakes.countDocuments({
    classId,
    period,
    index,
    id,
  });

  return exists > 0;
}

async function setRetakeScore({ retakeScore, ctx }) {
  validateRetakeScore({ retakeScore, ctx });

  if (!(await validateRetakeReference({ retakeScore, ctx }))) {
    throw new LeemonsError(ctx, {
      httpStatusCode: 400,
      code: 'INVALID_RETAKE_REFERENCE',
      message: 'Invalid retake reference, the retake index and id must match the same retake',
    });
  }

  const userAgentId = ctx.meta.userSession.userAgents[0].id;

  const { retakeId, retakeIndex, class: classId, period, user } = retakeScore;

  const response = await ctx.tx.db.RetakeScores.updateOne(
    { class: classId, period, user, retakeIndex, $or: [{ retakeId: null }, { retakeId }] },
    { $set: { ...retakeScore, gradedBy: userAgentId } },
    {
      upsert: true,
    }
  );

  return response.modifiedCount > 0 || response.upsertedCount > 0;
}

module.exports = setRetakeScore;
