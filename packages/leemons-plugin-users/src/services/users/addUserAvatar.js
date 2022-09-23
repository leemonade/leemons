const { table } = require('../tables');

async function addUserAvatar(user, avatar, { transacting } = {}) {
  const assetService = leemons.getPlugin('leebrary').services.assets;
  const assetData = {
    indexable: false,
    public: true,
    name: `user-${user.id}`,
  };
  if (avatar) assetData.cover = avatar;
  let asset;
  if (user.avatarAsset) {
    asset = await assetService.update(
      { ...assetData, id: user.avatarAsset },
      {
        published: true,
        userSession: user,
        transacting,
      }
    );
  } else {
    asset = await assetService.add(assetData, {
      published: true,
      userSession: user,
      transacting,
    });
  }
  const u = await table.users.update(
    { id: user.id },
    {
      avatar: `${assetService.getCoverUrl(asset.id)}?t=${Date.now()}`,
      avatarAsset: asset.id,
    },
    {
      transacting,
    }
  );

  return {
    ...u,
    avatar: assetService.getCoverUrl(asset.id),
  };
}

module.exports = { addUserAvatar };
