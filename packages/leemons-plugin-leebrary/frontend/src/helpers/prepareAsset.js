import { getAuthorizationTokenForAllCenters } from '@users/session';

function prepareAsset(assetFromApi) {
  const asset = { ...assetFromApi };

  [asset.fileType] = asset.file.type.split('/');
  asset.url = `${window.location.origin}/api/leebrary/file/${
    asset.file.id
  }?authorization=${getAuthorizationTokenForAllCenters()}`;

  if (asset.cover) {
    asset.cover = `${window.location.origin}/api/leebrary/file/${
      asset.cover.id
    }?authorization=${getAuthorizationTokenForAllCenters()}`;
  }

  return asset;
}

export { prepareAsset };
export default prepareAsset;
