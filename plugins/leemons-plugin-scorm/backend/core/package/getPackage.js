const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

async function getPackage({ id, ctx }) {
  // Check is userSession is provided
  if (!ctx.meta.userSession)
    throw new LeemonsError(ctx, { message: 'User session is required (getPackage)' });

  const ids = _.isArray(id) ? id : [id];

  const assignables = await Promise.all(
    _.map(ids, (_id) =>
      ctx.tx.call('assignables.assignables.getAssignable', { id: _id, withFiles: true })
    )
  );

  // Get the Package Asset in metadata
  const assets = await ctx.tx.call('leebrary.assets.getByIds', {
    ids: assignables.map((a) => a.metadata.packageAsset).filter(Boolean),
    withFiles: true,
  });

  const result = _.map(assignables, (assignable) => {
    const { asset, metadata, statement } = assignable;
    return {
      id: assignable.id,
      asset,
      statement,
      name: asset.name,
      tags: asset.tags,
      color: asset.color,
      cover: asset.cover,
      tagline: asset.tagline,
      description: asset.description,
      launchUrl: metadata.launchUrl,
      packageAsset: metadata.packageAsset,
      file: assets.find((f) => f.id === metadata.packageAsset)?.file,
      metadata,
      version: metadata.version,
      gradable: assignable.gradable,
    };
  });
  return _.isArray(id) ? result : result[0];
}

module.exports = getPackage;
