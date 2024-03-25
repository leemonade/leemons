import { capitalize, isEmpty, isNil, isString, toLower } from 'lodash';
import { getAuthorizationTokenForAllCenters, getCookieToken } from '@users/session';
import { prepareAssetType } from './prepareAssetType';

export function getAssetUrl(assetID) {
  const authTokens = getAuthorizationTokenForAllCenters();
  return `${leemons.apiUrl}/api/v1/leebrary/file/img/${assetID}?authorization=${encodeURIComponent(
    `${authTokens}`
  )}`;
}

export function getFileUrl(fileID, segment, isPublic = false) {
  if (!isString(fileID)) {
    return '';
  }

  if (fileID.startsWith('http')) {
    return fileID;
  }

  let authTokens = getAuthorizationTokenForAllCenters();
  if (isEmpty(JSON.parse(authTokens))) {
    const userToken = getCookieToken();
    authTokens = JSON.stringify([userToken]);
  }
  const urlSuffixSegment = segment ? `/${segment}` : '';

  const authParam = !isPublic ? `?authorization=${encodeURIComponent(authTokens)}` : '';

  return `${leemons.apiUrl}/api/v1/leebrary/file/${
    isPublic ? 'public/' : ''
  }${fileID}${urlSuffixSegment}${authParam}`;
}

export function getPublicFileUrl(fileID, segment) {
  return getFileUrl(fileID, segment, true);
}

export function isValidURL(url, checkAuthorization) {
  const urlPattern =
    /[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)?/gi;

  if (checkAuthorization && url.indexOf('authorization=') < 0) {
    return false;
  }

  return urlPattern.test(url) ? true : 'Invalid URL';
}

export function prepareAsset(assetFromApi, isPublished = true) {
  if (assetFromApi?.prepared && assetFromApi?.original) {
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
    } else if (isString(asset.cover) && !isValidURL(asset.cover, true)) {
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

export function isImageFile(file) {
  if (file?.type && file?.type.indexOf('image') === 0) {
    return true;
  }

  const name = file?.path || file?.name;

  if (!isEmpty(name)) {
    const ext = toLower(name.split('.').at(-1));
    return ['png', 'jpeg', 'jpg', 'webp', 'gif', 'bmp'].includes(ext);
  }

  return false;
}

export function isNullish(obj) {
  return Object.values(obj).every((value) => !!isNil(value));
}

export function getCoverUrl(cover) {
  if (isImageFile(cover)) {
    if (cover?.id) {
      return getFileUrl(cover.id);
    }

    if (cover instanceof File) {
      return URL.createObjectURL(cover);
    }
  }

  if (isString(cover) && isValidURL(cover)) {
    return cover;
  }

  return null;
}

export function getCoverName(cover) {
  if (cover) {
    return `${cover.name}.${cover.extension}`;
  }
  return null;
}

export function resolveAssetType(file, type, asset) {
  let defaultType = 'file';
  if (type === 'bookmarks') defaultType = 'bookmark';

  const isNewAsset = !asset?.id;
  const fileExtension = isNewAsset ? file?.name?.split('.').pop() : asset?.fileExtension;

  const fileType = file?.type?.split('/')[0]?.toLowerCase() || defaultType;
  const resolvedFileType = ['audio', 'video', 'image', 'bookmark'].includes(fileType)
    ? fileType
    : defaultType;

  return { fileType: resolvedFileType, fileExtension };
}

export default prepareAsset;
