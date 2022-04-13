import { capitalize, isEmpty, isNil } from 'lodash';
import { getAuthorizationTokenForAllCenters } from '@users/session';

function getFileUrl(fileID) {
  const authTokens = getAuthorizationTokenForAllCenters();
  return `${window.location.origin}/api/leebrary/file/${fileID}?authorization=${authTokens}`;
}

function prepareAsset(assetFromApi) {
  const asset = { ...assetFromApi };

  if (!isEmpty(asset.file)) {
    if (isEmpty(asset.fileType)) {
      const fileType = asset.file.type;

      if (fileType.indexOf('xml') > -1 || fileType.indexOf('document') > -1) {
        asset.fileType = 'document';
      } else {
        [asset.fileType] = fileType.split('/');
      }
    }

    if (isEmpty(asset.url)) {
      asset.url = getFileUrl(asset.file.id);
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

  if (!isEmpty(asset.cover?.id)) {
    asset.cover = getFileUrl(asset.cover.id);
  }

  if (!isEmpty(asset.icon?.id)) {
    asset.icon = getFileUrl(asset.icon.id);
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

export { prepareAsset, getFileUrl };
export default prepareAsset;
