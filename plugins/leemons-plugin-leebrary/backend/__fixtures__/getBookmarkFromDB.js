const getAssets = require('./getAssets');

const { bookmarkAsset: assetReference, assetDataExtraProps } = getAssets();
module.exports = function getBookmarkFromDB() {
  return {
    asset: assetReference.id,
    url: assetDataExtraProps.url,
    icon: '8f2b5ec7-1f91-4582-9f7f-6c2ba979bf42',
    id: 'soy-un-id',
    deleted: 0,
  };
};
