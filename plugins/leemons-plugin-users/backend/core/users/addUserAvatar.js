async function addUserAvatar({ user, avatar, ctx }) {
  if (avatar?.startsWith('http')) {
    return {
      ...user,
      avatar,
    };
  }

  const assetData = {
    indexable: false,
    public: true,
    name: `user-${user.id}`,
    cover: null,
  };

  if (avatar) {
    assetData.cover = avatar;
  }

  let asset;
  if (user.avatarAsset) {
    asset = await ctx.tx.call(
      'leebrary.assets.update',
      {
        data: { ...assetData, id: user.avatarAsset },
        published: true,
      },
      { meta: { ...ctx.meta, userSession: { ...user } } }
    );
  } else {
    asset = await ctx.tx.call(
      'leebrary.assets.add',
      {
        asset: assetData,
        published: true,
      },
      { meta: { ...ctx.meta, userSession: { ...user } } }
    );
  }

  const coverUrl = await ctx.tx.call('leebrary.assets.getCoverUrl', { assetId: asset.id });

  const u = await ctx.tx.db.Users.findOneAndUpdate(
    { id: user.id },
    {
      avatar: `${coverUrl}?t=${Date.now()}`,
      avatarAsset: asset.id,
    },
    { new: true, lean: true }
  );

  return {
    ...u,
    avatar: coverUrl,
  };
}

module.exports = { addUserAvatar };
