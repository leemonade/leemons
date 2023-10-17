const _ = require('lodash');
const { validateUpdateGradeScale } = require('../../validations/forms');

async function updateGradeScale({ data, ctx }) {
  await validateUpdateGradeScale({ data, ctx });
  const { id, ..._data } = data;
  return ctx.tx.db.GradeScales.findOneAndUpdate({ id }, _data, { new: true, lean: true });
}

module.exports = { updateGradeScale };
