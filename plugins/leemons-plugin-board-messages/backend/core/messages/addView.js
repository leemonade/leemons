const _ = require('lodash');

async function addView({ id, ctx }) {
  const config = await ctx.tx.db.MessageConfig.findOne({ id }).select(['totalViews']).lean();
  if (!_.isNumber(config.totalViews)) {
    config.totalViews = 0;
  }
  return Promise.all([
    ctx.tx.db.MessageConfig.findOneAndUpdate(
      { id },
      { totalViews: config.totalViews + 1 },
      { new: true, lean: true }
    ),
    ctx.tx.db.MessageConfigViews.create({
      messageConfig: id,
      userAgent: ctx.meta.userSession.userAgents[0].id,
    }).then((r) => r.toObject()),
  ]);
}

module.exports = { addView };
