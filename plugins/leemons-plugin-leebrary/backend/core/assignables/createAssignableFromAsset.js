const { set } = require('lodash');
const { getByIds: getAsset } = require('../assets/getByIds');
const { update: updateAsset } = require('../assets/update');

module.exports = async function createAssignableFromAsset({ assignable, ctx }) {
  if (typeof assignable.asset === 'string') {
    const asset = (await getAsset({ ids: [assignable.asset], showPublic: true, ctx }))[0];

    set(assignable, 'asset', asset);
  }

  set(assignable, 'asset.indexable', false);

  const createdAssignable = await ctx.tx.call('assignables.assignables.createAssignable', {
    assignable,
    published: true,
  });

  const assetId = createdAssignable.metadata.leebrary.asset;

  const asset = (await getAsset({ ids: [assetId], indexable: false, showPublic: true, ctx }))[0];

  const originalName = asset.name;
  const originalCover = asset.cover;

  const newName = assignable.asset.name;
  const newCover = assignable.asset.cover;

  if (originalName !== newName || originalCover !== newCover) {
    await updateAsset({
      data: {
        ...asset,
        name: assignable.asset.name,
        cover: assignable.asset.cover,
      },
      upgrade: false,
      published: true,
      ctx,
    });
  }

  return createdAssignable;
};
