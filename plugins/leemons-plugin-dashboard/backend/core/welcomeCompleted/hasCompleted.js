const { map } = require('lodash');

async function hasCompleted({ ctx }) {
  const { userAgents } = ctx.meta.userSession;
  const userAgentsIds = map(userAgents, 'id');

  const result = await ctx.tx.db.WelcomeCompleted.findOne({ userAgent: { $in: userAgentsIds } });

  return !!result;
}

module.exports = hasCompleted;
