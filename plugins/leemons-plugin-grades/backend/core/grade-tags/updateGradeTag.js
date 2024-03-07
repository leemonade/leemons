const _ = require('lodash');
const { validateUpdateGradeTag } = require('../../validations/forms');
const { getGradeTagsByIds } = require('./getGradeTagsByIds');

async function updateGradeTag({ data, ctx }) {
  await validateUpdateGradeTag({ data, ctx });
  const { id, ..._data } = data;
  await ctx.tx.db.GradeTags.updateOne({ id }, _data);
  return (await getGradeTagsByIds({ ids: id, ctx }))[0];
}

module.exports = { updateGradeTag };
