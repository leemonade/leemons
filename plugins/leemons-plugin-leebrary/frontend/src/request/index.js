import deleteAsset from './deleteAsset';
import duplicateAsset from './duplicateAsset';
import getAsset from './getAsset';
import getAssets from './getAssets';
import getAssetsByIds from './getAssetsByIds';
import getAssetTypes from './getAssetTypes';
import getProviders from './getProviders';
import getUrlMetadata from './getUrlMetadata';
import hasPins from './hasPins';
import listAllMyFiles from './listAllMyFiles';
import listCategories from './listCategories';
import newAsset from './newAsset';
import pinAsset from './pinAsset';
import removeFile from './removeFile';
import setPermissions from './setPermissions';
import unpinAsset from './unpinAsset';
import updateAsset from './updateAsset';
import uploadFiles from './uploadFiles';

export const getProvidersRequest = getProviders;
export const removeFileRequest = removeFile;
export const uploadFilesRequest = uploadFiles;
export const listAllMyFilesRequest = listAllMyFiles;
export const listCategoriesRequest = listCategories;
export const newAssetRequest = newAsset;
export const getAssetRequest = getAsset;
export const getAssetsRequest = getAssets;
export const getAssetsByIdsRequest = getAssetsByIds;
export const setPermissionsRequest = setPermissions;
export const getUrlMetadataRequest = getUrlMetadata;
export const duplicateAssetRequest = duplicateAsset;
export const deleteAssetRequest = deleteAsset;
export const updateAssetRequest = updateAsset;
export const getAssetTypesRequest = getAssetTypes;
export const pinAssetRequest = pinAsset;
export const unpinAssetRequest = unpinAsset;
export const hasPinsRequest = hasPins;
