const _ = require('lodash');
const { validateAddGradeScale } = require('../../validations/forms');

async function addGradeScale({ data, ctx }) {
  await validateAddGradeScale({ data, ctx });
  const result = await ctx.tx.db.GradeScales.create(data);
  return result.toObject();
}

module.exports = { addGradeScale };
