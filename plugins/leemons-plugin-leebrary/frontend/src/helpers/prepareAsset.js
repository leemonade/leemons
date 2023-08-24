import { capitalize, isEmpty, isNil, isString } from 'lodash';
import { getAuthorizationTokenForAllCenters } from '@users/session';
import { prepareAssetType } from './prepareAssetType';

function getAssetUrl(assetID) {
  const authTokens = getAuthorizationTokenForAllCenters();
  return `${leemons.apiUrl}/api/leebrary/img/${assetID}?authorization=${encodeURIComponent(
    `${authTokens}`
  )}`;
}

function getFileUrl(fileID, segment, isPublic = false) {
  if (!isString(fileID)) {
    return '';
  }

  const authTokens = getAuthorizationTokenForAllCenters();
  const urlSuffixSegment = segment ? `/${segment}` : '';

  if (fileID.startsWith('http')) {
    return fileID;
  }

  const authParam = !isPublic ? `?authorization=${encodeURIComponent(`${authTokens}`)}` : '';

  return `${leemons.apiUrl}/api/leebrary/file/${
    isPublic ? 'public/' : ''
  }${fileID}${urlSuffixSegment}${authParam}`;
}

function getPublicFileUrl(fileID, segment) {
  return getFileUrl(fileID, segment, true);
}

function prepareAsset(assetFromApi, isPublished = true) {
  if (assetFromApi.prepared && assetFromApi.original) {
    return assetFromApi;
  }

  const asset = { ...assetFromApi, original: assetFromApi, prepared: true };
  asset.public = [1, '1', true, 'true'].includes(asset.public);
  asset.canAccess = asset.canAccess || [];

  if (isNil(asset.pinneable)) {
    asset.pinneable = isPublished;
  }

  if (!isEmpty(asset.file)) {
    if (isEmpty(asset.fileType)) {
      asset.fileType = prepareAssetType(asset.file.type, false);
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

  if (asset.cover) {
    if (!isEmpty(asset.cover?.id)) {
      asset.cover = getFileUrl(asset.cover.id);
    } else if (asset.cover instanceof File) {
      asset.cover = URL.createObjectURL(asset.cover);
    } else if (isString(asset.cover)) {
      asset.cover = getFileUrl(asset.cover);
    }
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

export { prepareAsset, getFileUrl, getAssetUrl, getPublicFileUrl };
export default prepareAsset;
