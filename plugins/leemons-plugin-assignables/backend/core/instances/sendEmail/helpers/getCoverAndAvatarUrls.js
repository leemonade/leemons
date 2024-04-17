const { isString } = require('lodash');

async function getCoverAndAvatarUrls({ instance, userSession, hostname, hostnameApi, ctx }) {
  const { deploymentID } = ctx.meta;

  let avatarUrl = userSession?.avatar;
  let coverUrl = await ctx.tx.call('leebrary.assets.getCoverUrl', {
    assetId: instance.assignable.asset.id,
  });

  if (isString(avatarUrl)) {
    if (!avatarUrl.startsWith('http')) {
      avatarUrl = `${hostnameApi || hostname}${avatarUrl}`;
    }
    const avatarUrlObj = new URL(avatarUrl);
    avatarUrlObj.searchParams.append('deploymentID', deploymentID);
    avatarUrl = avatarUrlObj.toString();
  }

  if (isString(coverUrl)) {
    if (!coverUrl.startsWith('http')) {
      coverUrl = `${hostnameApi || hostname}${coverUrl}`;
    }
    const coverUrlObj = new URL(coverUrl);
    coverUrlObj.searchParams.append('deploymentID', deploymentID);
    coverUrl = coverUrlObj.toString();
  }

  return { avatarUrl, coverUrl };
}

module.exports = { getCoverAndAvatarUrls };
