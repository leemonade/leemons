const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { getUserAgentsInfo } = require('../user-agents/getUserAgentsInfo');
const { getPreferences } = require('../user-preferences/getPreferences');
const { getUserDatasetInfo } = require('../user-agents/getUserDatasetInfo');

async function detailForPage({ userId, ctx }) {
  const [user, preferences, dataset] = await Promise.all([
    ctx.tx.db.Users.findOne({ id: userId }).lean(),
    getPreferences({ user: userId, ctx }),
    getUserDatasetInfo({ userId, ctx }),
  ]);
  if (!user) throw new LeemonsError(ctx, { message: 'User not found' });
  const userAgentsIds = await ctx.tx.db.UserAgent.find({ user: user.id }).select(['id']).lean();
  const userAgents = await getUserAgentsInfo({
    userAgentIds: _.map(userAgentsIds, 'id'),
    withProfile: true,
    withCenter: true,
    ctx,
  });

  return {
    user: {
      ...user,
      preferences,
    },
    userAgents,
    dataset,
  };
}

module.exports = { detailForPage };
