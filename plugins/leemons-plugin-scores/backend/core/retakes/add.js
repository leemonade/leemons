const getLatestRetake = require('./getLatest');
const validateRetake = require('./validations/validateRetake');

async function addRetake({ retake, ctx }) {
  validateRetake({ retake, ctx });

  const latestRetake = await getLatestRetake({
    classId: retake.classId,
    period: retake.period,
    ctx,
  });

  const { id, index } = await ctx.tx.db.Retakes.create({
    ...retake,
    index: latestRetake ? latestRetake + 1 : 1,
  });

  return { id, index };
}

module.exports = addRetake;
