const { get } = require('lodash');

function handleNonIndexableAssetsNeeded(nonIndexableAssets, assetToAdd) {
  const match = nonIndexableAssets.find(({ asset }) => asset.id === assetToAdd.id);
  if (match) {
    return match.bulkId;
  }
  const notIndexablesCount = nonIndexableAssets.length;
  const bulkId = `LNI_${notIndexablesCount + 1}`;
  nonIndexableAssets.push({ bulkId, asset: assetToAdd });
  return bulkId;
}

function getDuplicatedAssetsReferenceAsString({
  libraryAssets,
  dups,
  separator = ',',
  addNotFoundToNonIndexableAssets = false,
  nonIndexableAssets,
}) {
  const keysToCompare = [
    'name',
    'fromUser',
    'fromUserAgent',
    'fileExtension',
    'fileType',
    'category',
    'description',
    'program',
    'color',
    'file.name',
    'file.extension',
    'file.metadata',
  ];

  const libraryResourcesMatching = dups
    .map((asset) => {
      const matchingAsset = libraryAssets.find((libraryResource) =>
        keysToCompare.every((key) => get(asset, key) === get(libraryResource.asset, key))
      );
      if (matchingAsset) {
        return matchingAsset.bulkId;
      }
      if (addNotFoundToNonIndexableAssets && nonIndexableAssets) {
        return handleNonIndexableAssetsNeeded(nonIndexableAssets, asset);
      }
      return undefined;
    })
    .filter((matchedItem) => matchedItem !== undefined);

  return libraryResourcesMatching.join(separator);
}

module.exports = {
  getDuplicatedAssetsReferenceAsString,
  handleNonIndexableAssetsNeeded,
};
