const { map } = require('lodash');

async function unregister({ ctx }) {
  const { userAgents } = ctx.meta.userSession;

  const userAgentsIds = map(userAgents, 'id');

  await ctx.tx.db.WelcomeCompleted.deleteMany({ userAgent: userAgentsIds });

  return true;
}

module.exports = unregister;
