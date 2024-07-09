const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getUserAgentsInfo } = require('../user-agents/getUserAgentsInfo');
const { getPreferences } = require('../user-preferences/getPreferences');

async function detailForPage({ userId, ctx }) {
  const [user, preferences, dataset] = await Promise.all([
    ctx.tx.db.Users.findOne({ id: userId }).lean(),
    getPreferences({ user: userId, ctx }),
  ]);
  if (!user) throw new LeemonsError(ctx, { message: 'User not found' });
  const userAgentsIds = await ctx.tx.db.UserAgent.find({ user: user.id }).select(['id']).lean();
  const [userAgents, avatar] = await Promise.all([
    getUserAgentsInfo({
      userAgentIds: _.map(userAgentsIds, 'id'),
      withProfile: true,
      withCenter: true,
      ctx,
    }),
    ctx.tx.call('leebrary.assets.getByIds', {
      ids: [user.avatarAsset],
      withFiles: false,
      withSubjects: false,
      withTags: false,
      withCategory: false,
      checkPins: false,
      checkPermissions: false,
      showPublic: true,
    }),
  ]);

  return {
    user: {
      ...user,
      preferences,
      avatarAsset: avatar[0] ?? user.avatarAsset,
    },
    userAgents,
    dataset,
  };
}

module.exports = { detailForPage };
