const _ = require('lodash');

async function getPackage(id, { userSession, transacting } = {}) {
  const { assignables: assignableService } = leemons.getPlugin('assignables').services;
  const { assets: assetService } = leemons.getPlugin('leebrary').services;

  // Check is userSession is provided
  if (!userSession) throw new Error('User session is required (getPackage)');

  const ids = _.isArray(id) ? id : [id];

  const assignables = await Promise.all(
    _.map(ids, (_id) =>
      assignableService.getAssignable(_id, {
        userSession,
        withFiles: true,
        transacting,
      })
    )
  );

  // Get the Package Asset in metadata
  const assets = await assetService.getByIds(
    assignables.map((a) => a.metadata.packageAsset).filter(Boolean),
    { withFiles: true }
  );

  const result = _.map(assignables, (assignable) => {
    const { asset, metadata, statement } = assignable;
    const toReturn = {
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
    return toReturn;
  });
  return _.isArray(id) ? result : result[0];
}

module.exports = getPackage;
