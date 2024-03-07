const _ = require('lodash');
const { validateAddGradeTag } = require('../../validations/forms');
const { getGradeTagsByIds } = require('./getGradeTagsByIds');

async function addGradeTag({ data, ctx }) {
  await validateAddGradeTag({ data, ctx });
  let tag = await ctx.tx.db.GradeTags.create(data);
  tag = tag.toObject();
  return (await getGradeTagsByIds({ ids: tag.id, ctx }))[0];
}

module.exports = { addGradeTag };
