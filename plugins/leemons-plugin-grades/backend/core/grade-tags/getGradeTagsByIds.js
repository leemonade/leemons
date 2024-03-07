const _ = require('lodash');

async function getGradeTagsByIds({ ids, ctx }) {
  const tags = await ctx.tx.db.GradeTags.find({ id: _.isArray(ids) ? ids : [ids] }).lean();
  const scales = await ctx.tx.db.GradeScales.find({ id: _.map(tags, 'scale') }).lean();
  const scalesByIds = _.keyBy(scales, 'id');
  return _.map(tags, (tag) => ({
    ...tag,
    scale: scalesByIds[tag.scale],
  }));
}

module.exports = { getGradeTagsByIds };
