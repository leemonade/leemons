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

module.exports = { getDuplicatedAssetsReferenceAsString };
