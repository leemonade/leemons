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
    console.log('Update', assetData);
    asset = await assetService.update(
      { ...assetData, id: user.avatarAsset },
      {
        published: true,
        userSession: user,
        transacting,
      }
    );
  } else {
    console.log('Create', assetData);
    asset = await assetService.add(assetData, {
      published: true,
      userSession: user,
      transacting,
    });
  }
  return table.users.update(
    { id: user.id },
    {
      avatar: assetService.getCoverUrl(asset.id),
      avatarAsset: asset.id,
    },
    {
      transacting,
    }
  );
}

module.exports = { addUserAvatar };
