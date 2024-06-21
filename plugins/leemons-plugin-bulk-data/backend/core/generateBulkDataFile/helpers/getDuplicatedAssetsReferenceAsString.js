const { get } = require('lodash');

function getDuplicatedAssetsReferenceAsString(libraryAssets, dups, separator = ',') {
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
    .map((asset) =>
      libraryAssets.find((libraryResource) =>
        keysToCompare.every((key) => get(asset, key) === get(libraryResource.asset, key))
      )
    )
    .filter((matchedItem) => matchedItem !== undefined);

  return libraryResourcesMatching.map((item) => item.bulkId).join(separator);
}

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

module.exports = {
  getDuplicatedAssetsReferenceAsString,
  handleNonIndexableAssetsNeeded,
};
