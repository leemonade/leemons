const { isEmpty, forEach, map } = require('lodash');

const { assetRoles } = require('../../../config/constants');
const getAssetPermissionName = require('../../permissions/helpers/getAssetPermissionName');

/**
 * Handles the permissions of the asset.
 * This function adds permissions to the asset and assigns these permissions to users.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {Array<Object>} params.permissions - An array of permissions to be added to the asset. Each permission is an object that contains the permission's data.
 * @param {Array<Object>} [params.canAccess] - An array of users who can access the asset. Each user is represented by an object that contains the user's data.
 * @param {Object} params.asset - The asset to which the permissions are to be added. This is an object that contains the asset's data.
 * @param {Object} params.category - The category to which the asset belongs. This is an object that contains the category's data.
 * @param {MoleculerContext} params.ctx - The Moleculer context which contains meta information and transaction details.
 * @returns {Promise<void>} A promise that resolves when permissions are handled.
 */

async function handlePermissions({ permissions, canAccess, asset, category, ctx }) {
  const { userSession } = ctx.meta;
  const permissionName = getAssetPermissionName({ assetId: asset.id, ctx });

  // ES: Primero, añadimos permisos al archivo
  // EN: First, add permission to the asset
  const permissionsPromises = [
    ctx.tx.call('users.permissions.addItem', {
      item: asset.id,
      type: ctx.prefixPN(category.id),
      data: {
        permissionName,
        actionNames: assetRoles,
      },
      isCustomPermission: true,
    }),
  ];

  if (permissions?.length) {
    forEach(permissions, ({ isCustomPermission, canEdit, canView, canAssign, ...per }) => {
      let permission = 'can-view';
      if (canEdit) {
        permission = 'can-edit';
      } else if (canAssign) {
        permission = 'can-assign';
      }
      permissionsPromises.push(
        ctx.tx.call('users.permissions.addItem', {
          item: asset.id,
          type: ctx.prefixPN(`asset.${permission}`),
          data: { ...per },
          isCustomPermission,
        })
      );
    });
  }
  await Promise.all(permissionsPromises);

  // ES: Luego, añade los permisos a los usuarios
  // EN: Then, add the permissions to the users
  const permissionsToAdd = [];
  let hasOwner = false;

  if (canAccess && !isEmpty(canAccess)) {
    for (let i = 0, len = canAccess.length; i < len; i++) {
      const { userAgent, role } = canAccess[i];
      hasOwner = hasOwner || role === 'owner';

      permissionsToAdd.push(
        ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
          userAgentId: userAgent,
          data: {
            permissionName,
            actionNames: [role],
            target: category.id,
          },
        })
      );
    }
  }

  if (!hasOwner) {
    permissionsToAdd.push(
      ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
        userAgentId: map(userSession?.userAgents, 'id'),
        data: {
          permissionName,
          actionNames: ['owner'],
          target: category.id,
        },
      })
    );
  }

  await Promise.all(permissionsToAdd);
  return true;
}

module.exports = { handlePermissions };
