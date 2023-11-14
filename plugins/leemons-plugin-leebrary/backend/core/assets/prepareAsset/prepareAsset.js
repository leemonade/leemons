const { capitalize, isEmpty, isNil, isString } = require('lodash');
const { prepareAssetType } = require('./prepareAssetType');
const { getFileUrl } = require('./getFileUrl');

async function prepareAsset({ rawAsset, isPublished = true, ctx }) {
  // Create a prepared asset that also contains the original raw asset
  const asset = { ...rawAsset, original: rawAsset, prepared: true };
  asset.public = [1, '1', true, 'true'].includes(asset.public);
  asset.canAccess = asset.canAccess || [];

  if (isNil(asset.pinneable)) {
    asset.pinneable = isPublished;
  }

  if (!isEmpty(asset.file) && asset.file.provider !== 'sys') {
    if (isEmpty(asset.fileType)) {
      asset.fileType = prepareAssetType(asset.file.type, false);
    }

    if (isEmpty(asset.url)) {
      asset.url = await getFileUrl({
        fileID: asset.file.id,
        provider: asset.file.provider,
        uri: asset.file.uri,
        ctx,
      });
    }

    if (isEmpty(asset.fileExtension)) {
      asset.fileExtension = asset.file.extension;
    }

    if (isNil(asset.metadata) && asset.file.metadata) {
      let { metadata } = asset.file;
      if (typeof metadata === 'string') {
        metadata = JSON.parse(metadata);
      }
      asset.metadata = Object.keys(metadata).map((key) => ({
        value: metadata[key],
        label: capitalize(key),
      }));
    }
  }

  if (asset.cover && asset.cover.provider !== 'sys') {
    if (!isEmpty(asset.cover?.id)) {
      asset.cover = await getFileUrl({
        fileID: asset.cover.id,
        provider: asset.cover.provider,
        uri: asset.cover.uri,
        ctx,
      });
    } else if (asset.cover instanceof File) {
      console.log('🛑 Instance of file! asset.cover', asset.cover);
      asset.cover = URL.createObjectURL(asset.cover);
    } else if (isString(asset.cover)) {
      asset.cover = await getFileUrl({ fileID: asset.cover, ctx });
    }
  }

  if (!isEmpty(asset.icon?.id) && asset.icon.provider !== 'sys') {
    asset.icon = await getFileUrl({
      fileID: asset.icon.id,
      provider: asset.icon.provider,
      uri: asset.icon.uri,
      ctx,
    });
  }

  if (!isEmpty(asset.canAccess)) {
    asset.canAccess = asset.canAccess.map((user) => {
      const item = { ...user };
      item.fullName = `${user.name} ${user.surnames}`;
      return item;
    });
  }

  return asset;
}

module.exports = { prepareAsset };
