const { map } = require('lodash');

async function register({ ctx }) {
  const { userAgents } = ctx.meta.userSession;

  const data = map(userAgents, (userAgent) => ({
    userAgent: userAgent.id,
  }));

  try {
    await ctx.tx.db.WelcomeCompleted.insertMany(data);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = register;
