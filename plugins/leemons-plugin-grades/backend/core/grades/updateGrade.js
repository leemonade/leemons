const _ = require('lodash');
const { validateUpdateGrade } = require('../../validations/forms');
const { gradeByIds } = require('./gradeByIds');

async function updateGrade({ data, ctx }) {
  await validateUpdateGrade({ data, ctx });

  const { id, ..._data } = data;

  await ctx.tx.db.Grades.updateOne({ id }, _data);

  return (await gradeByIds({ ids: id, ctx }))[0];
}

module.exports = { updateGrade };
