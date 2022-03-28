import { capitalize } from 'lodash';
import { getAuthorizationTokenForAllCenters } from '@users/session';

function getFileUrl(fileID) {
  const authTokens = getAuthorizationTokenForAllCenters();
  return `${window.location.origin}/api/leebrary/file/${fileID}?authorization=${authTokens}`;
}

function prepareAsset(assetFromApi) {
  const asset = { ...assetFromApi };

  [asset.fileType] = asset.file.type.split('/');
  asset.url = getFileUrl(asset.file.id);

  if (asset.cover) {
    asset.cover = getFileUrl(asset.cover.id);
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
