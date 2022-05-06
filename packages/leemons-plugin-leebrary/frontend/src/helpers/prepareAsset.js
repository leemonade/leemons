import { capitalize, intersection, isEmpty, isNil } from 'lodash';
import { getAuthorizationTokenForAllCenters, getCentersWithToken } from '@users/session';
import { prepareAssetType } from './prepareAssetType';

function getFileUrl(fileID) {
  const authTokens = getAuthorizationTokenForAllCenters();
  return `${window.location.origin}/api/leebrary/file/${fileID}?authorization=${encodeURIComponent(
    `${authTokens}`
  )}`;
}

function prepareAsset(assetFromApi, isPublished = true) {
  if (assetFromApi.prepared && assetFromApi.original) {
    return assetFromApi;
  }

  const userAgents = getCentersWithToken().map((item) => item.userAgentId);
  const asset = { ...assetFromApi, original: assetFromApi, prepared: true };
  asset.public = [1, '1', true, 'true'].includes(asset.public);
  asset.canAccess = asset.canAccess || [];

  // TODO: Move all this permission logic to backend
  const deleteRoles = ['owner'];
  const shareRoles = ['owner', 'editor'];
  const editRoles = ['owner', 'editor'];

  if (isNil(asset.pinneable)) {
    asset.pinneable = isPublished;
  }

  if (isNil(asset.editable)) {
    const canEdit = asset.canAccess.some(
      (item) =>
        intersection(item.permissions, editRoles).length > 0 &&
        intersection(item.userAgentIds, userAgents).length > 0
    );

    asset.editable = canEdit;
  }

  if (isNil(asset.deleteable)) {
    const canDelete = asset.canAccess.some(
      (item) =>
        intersection(item.permissions, deleteRoles).length > 0 &&
        intersection(item.userAgentIds, userAgents).length > 0
    );

    asset.deleteable = canDelete;
  }

  if (isNil(asset.shareable)) {
    const canShare = asset.canAccess.some(
      (item) =>
        intersection(item.permissions, shareRoles).length > 0 &&
        intersection(item.userAgentIds, userAgents).length > 0
    );
    asset.shareable = canShare;
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
    }
    if (asset.cover instanceof File) {
      asset.cover = URL.createObjectURL(asset.cover);
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

export { prepareAsset, getFileUrl };
export default prepareAsset;
