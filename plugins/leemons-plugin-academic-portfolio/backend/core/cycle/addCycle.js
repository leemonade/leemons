const { validateAddCycle } = require('../../validations/forms');

async function addCycle({ data, ctx }) {
  validateAddCycle(data);
  const cycleDoc = await ctx.tx.db.Cycles.create({
    ...data,
    courses: JSON.stringify(data.courses),
  });
  return cycleDoc.toObject();
}

module.exports = { addCycle };
