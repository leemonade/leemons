import { capitalize, isEmpty } from 'lodash';
import { getAuthorizationTokenForAllCenters } from '@users/session';

function getFileUrl(fileID) {
  const authTokens = getAuthorizationTokenForAllCenters();
  return `${window.location.origin}/api/leebrary/file/${fileID}?authorization=${authTokens}`;
}

function prepareAsset(assetFromApi) {
  const asset = { ...assetFromApi };

  if (isEmpty(asset.fileType)) {
    const fileType = asset.file.type;

    if (fileType.indexOf('xml') > -1 || fileType.indexOf('document') > -1) {
      asset.fileType = 'document';
    } else {
      [asset.fileType] = fileType.split('/');
    }
  }

  asset.fileExtension = asset.fileExtension || asset.file.extension;

  asset.url = asset.url || getFileUrl(asset.file.id);

  if (!isEmpty(asset.cover?.id)) {
    asset.cover = getFileUrl(asset.cover.id);
  }

  if (!isEmpty(asset.icon?.id)) {
    asset.icon = getFileUrl(asset.icon.id);
  }

  if (asset.file?.metadata) {
    let { metadata } = asset.file;
    if (typeof metadata === 'string') {
      metadata = JSON.parse(metadata);
    }
    asset.metadata = Object.keys(metadata).map((key) => ({
      value: metadata[key],
      label: capitalize(key),
    }));
  }

  return asset;
}

export { prepareAsset, getFileUrl };
export default prepareAsset;
