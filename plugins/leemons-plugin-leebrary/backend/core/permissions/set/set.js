/* eslint-disable no-inner-declarations */
/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateSetPermissions } = require('../../validations/forms');
const { getByIds } = require('../../assets/getByIds');
const { update: updateAsset } = require('../../assets/update');
const { getByAssets } = require('../getByAssets');
const { checkIfRolesExist } = require('./checkIfRolesExist');
const { handleAddPermissionsToUserAgent } = require('./handleAddPermissionsToUserAgent');
const { handleAddPermissionsToAsset } = require('./handleAddPermissionsToAsset');
const { handleRemoveMissingPermissions } = require('./handleRemoveMissingPermissions');

/**
 * Set permissions/roles for userAgents to access a specified assetID
 * @public
 * @static
 * @param {Object} params - Parameters object
 * @param {string} params.assetId - Asset ID
 * @param {boolean} params.isPublic - Boolean indicating if the asset is public
 * @param {Object} params.permissions - Permissions object
 * @param {Array} params.canAccess - Array of objects with userAgent and role properties
 * @param {boolean} [params.deleteMissing] - Flag that indicates if missing permissions or user agent permissions should be deleted
 * @param {Object} params.ctx - The moleculer context
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean
 */
async function set({ assetId, isPublic, permissions, canAccess, deleteMissing, ctx }) {
  try {
    const assetIds = _.isArray(assetId) ? assetId : [assetId];
    await validateSetPermissions({ assets: assetIds, permissions, canAccess, isPublic });

    // ES: Comprobamos si los roles que se quieren usar existen
    checkIfRolesExist({ canAccess, permissions, ctx });

    // ES: Sacamos que rol (viewer|editor|owner) tiene el usuario actual para el asset que quiere actualizar
    const [assetsRole, assetsData] = await Promise.all([
      getByAssets({ assetIds, ctx }),
      getByIds({ ids: assetIds, ctx }),
    ]);
    const assetsDataById = _.keyBy(assetsData, 'id');
    const assetsRoleById = {};
    _.forEach(assetsRole, (assetRole) => {
      assetsRoleById[assetRole.asset] = assetRole.role;
    });
    // ES: Comprobamos que el usuario actual tiene permisos para actualizar los assets
    _.forEach(assetIds, (id) => {
      if (assetsRoleById[id] !== 'owner' && (isPublic || assetsDataById[id].public)) {
        throw new LeemonsError(ctx, {
          message: 'Only owner can set public permissions.',
          httpStatusCode: 412,
        });
      }
    });

    // ES: Actualizamos los permisos del asset para que sea publico si hace falta
    const updatePromises = [];
    _.forEach(assetIds, async (id) => {
      if (isPublic || assetsDataById[id].public) {
        updatePromises.push(
          updateAsset({ data: { ...assetsDataById[id], public: isPublic }, ctx })
        );
      }
    });

    if (updatePromises.length) {
      await Promise.all(updatePromises);
    }

    if (canAccess?.length) {
      await handleAddPermissionsToUserAgent({
        canAccess,
        assetIds,
        assetsDataById,
        assetsRoleById,
        ctx,
      });
    }

    if (permissions) {
      await handleAddPermissionsToAsset({
        permissions,
        assetIds,
        assetsDataById,
        assetsRoleById,
        ctx,
      });
    }

    if (deleteMissing) {
      handleRemoveMissingPermissions({
        canAccess,
        permissions,
        assetIds,
        assetsRoleById,
        ctx,
      });
    }

    return true;
  } catch (e) {
    ctx.logger.error(e);
    throw e;
  }
}

module.exports = { set };
