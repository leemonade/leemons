const { find, isNil, intersection, isArray } = require('lodash');
const { CATEGORIES } = require('../../../config/constants');
/**
 * Processes the final asset by adding additional properties based on permissions, categories, tags, and pins.
 * @async
 * @param {Object} params - The params object
 * @param {Object} params.asset - The asset to process
 * @param {Object} params.programsById - The programs aggregated by ID
 * @param {Object} params.permissionsByAsset - The permissions aggregated by asset
 * @param {Array} params.canEditPermissions - The permissions that the user can edit
 * @param {boolean} params.withCategory - Flag to include category in the response
 * @param {Array} params.categories - The categories associated with the assets
 * @param {Array} params.assetCategoryData - The category data associated with the assets
 * @param {boolean} params.withTags - Flag to include tags in the response
 * @param {Array} params.tags - The tags associated with the assets
 * @param {boolean} params.checkPins - Flag to check pins
 * @param {Array} params.pins - The pins associated with the assets
 * @param {Array} params.userAgents - The user agents associated with the user session
 * @returns {Object} - Returns the processed asset with additional properties
 */
function processFinalAsset({
  asset,
  programsById,
  permissionsByAsset,
  canEditPermissions,
  withCategory,
  categories,
  assetCategoryData,
  withTags,
  tags,
  checkPins,
  pins,
  userAgents,
}) {
  const item = { ...asset };

  const deleteRoles = ['owner'];
  const shareRoles = ['owner', 'editor'];
  const editRoles = ['owner', 'editor'];
  const assignRoles = ['owner', 'editor', 'assigner'];

  if (item.program) {
    item.programName = programsById[item.program]?.name;
  }

  item.permissions = permissionsByAsset[item.id] || { viewer: [], editor: [] };

  if (withCategory) {
    const { key, duplicable, assignable } = find(categories, { id: asset.category });
    item.duplicable = duplicable;
    item.assignable = assignable;
    item.downloadable = key === CATEGORIES.MEDIA_FILES;
    item.providerData = find(assetCategoryData, { asset: asset.id });
  }

  if (withTags) {
    [item.tags] = tags;
  }

  if (checkPins) {
    const pin = find(pins, { asset: asset.id });
    item.pinned = !isNil(pin?.id);
  }

  if (isArray(item.canAccess)) {
    item.editable = item.canAccess.some(
      (permission) =>
        intersection(permission.permissions, editRoles).length > 0 &&
        intersection(permission.userAgentIds, userAgents).length > 0
    );

    item.deleteable = item.canAccess.some(
      (permission) =>
        intersection(permission.permissions, deleteRoles).length > 0 &&
        intersection(permission.userAgentIds, userAgents).length > 0
    );

    item.shareable = item.canAccess.some(
      (permission) =>
        intersection(permission.permissions, shareRoles).length > 0 &&
        intersection(permission.userAgentIds, userAgents).length > 0
    );

    item.assignable = item.canAccess.some(
      (permission) =>
        intersection(permission.permissions, assignRoles).length > 0 &&
        intersection(permission.userAgentIds, userAgents).length > 0
    );

    item.role = 'viewer';
    if (
      item.canAccess.some(
        (permission) =>
          intersection(permission.permissions, ['editor']).length > 0 &&
          intersection(permission.userAgentIds, userAgents).length > 0
      )
    ) {
      item.role = 'editor';
    }

    if (
      item.canAccess.some(
        (permission) =>
          intersection(permission.permissions, ['owner']).length > 0 &&
          intersection(permission.userAgentIds, userAgents).length > 0
      )
    ) {
      item.role = 'owner';
    }
  }

  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (canEditPermissions.includes(item.id)) {
    if (item.role !== 'owner') {
      item.role = 'editor';
      item.editable = editRoles.includes('editor');
      item.deleteable = deleteRoles.includes('editor');
      item.shareable = shareRoles.includes('editor');
      item.assignable = assignRoles.includes('editor');
    }
  }

  return item;
}

module.exports = { processFinalAsset };
