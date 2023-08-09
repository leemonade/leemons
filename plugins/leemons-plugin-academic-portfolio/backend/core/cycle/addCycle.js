const { validateAddCycle } = require('../../validations/forms');

async function addCycle({ data, ctx }) {
  await validateAddCycle(data);
  return ctx.tx.db.Cycles.create({ ...data, courses: JSON.stringify(data.courses) });
}

module.exports = { addCycle };
