const _ = require('lodash');

async function addClick({ id, ctx }) {
  const { userSession } = ctx.meta;
  const config = await ctx.tx.db.MessageConfig.findOne({ id }).select(['totalClicks']).lean();
  if (!_.isNumber(config.totalClicks)) {
    config.totalClicks = 0;
  }
  return Promise.all([
    ctx.tx.db.MessageConfig.findOneAndUpdate(
      { id },
      { totalClicks: config.totalClicks + 1 },
      { new: true, lean: true }
    ),
    ctx.tx.db.MessageConfigClicks.create({
      messageConfig: id,
      userAgent: userSession.userAgents[0].id,
    }).then((r) => r.toObject()),
  ]);
}

module.exports = { addClick };
