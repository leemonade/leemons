const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const canAssignRole = require('../helpers/canAssignRole');

const rolePermissionType = {
  editor: 'asset.can-edit',
  viewer: 'asset.can-view',
  assigner: 'asset.can-assign',
};

/**
 * This function adds permissions to an asset.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.id - The id of the asset.
 * @param {string} params.categoryId - The id of the category.
 * @param {Object} params.permissions - The permissions to be added.
 * @param {string} params.assignerRole - The role of the assigner.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<undefined>} - A promise that resolves when all permissions have been added.
 */

async function addPermissionsToAsset({ id, categoryId, permissions, assignerRole, ctx }) {
  const roles = Object.keys(permissions);
  const allPermissions = [];
  // ES: Añadimos todos los permisos que queremos añadir a un array para despues consultar cuales de todos los permisos que queremos añadir ya tenemos actualmente
  _.forEach(roles, (role) => {
    allPermissions.push(...permissions[role]);
  });

  const currentPermissions = await ctx.tx.call('users.permissions.findItems', {
    params: {
      item: id,
      permissionName: allPermissions,
      type: { $regex: `^${_.escapeRegExp(ctx.prefixPN('asset'))}` },
    },
  });

  // ES: Comprobamos que tengamos acceso a asignar todos los permisos
  const currentPermissionsByPermissionName = _.keyBy(currentPermissions, 'permissionName');
  _.forEach(roles, (role) => {
    _.forEach(permissions[role], (permission) => {
      const currPerm = currentPermissionsByPermissionName[permission];
      let oldRole = 'viewer';
      if (currPerm?.type.includes('can-edit')) {
        oldRole = 'editor';
      } else if (currPerm?.type.includes('can-assign')) {
        oldRole = 'assigner';
      }
      if (
        !canAssignRole({
          userRole: assignerRole,
          assignedUserCurrentRole: oldRole,
          newRole: role,
          ctx,
        })
      ) {
        throw new LeemonsError(ctx, {
          message: `You don't have permission to assign the permission "${permission}" with role "${role}"`,
          httpStatusCode: 401,
        });
      }
    });
  });

  // EN: Remove existing permissions
  // ES: Eliminar permisos de existentes
  await ctx.tx.call('users.permissions.removeItems', {
    query: {
      type: [
        ctx.prefixPN(rolePermissionType.editor),
        ctx.prefixPN(rolePermissionType.viewer),
        ctx.prefixPN(rolePermissionType.assigner),
      ],
      item: id,
      permissionName: allPermissions,
    },
  });

  // EN: Save permissions
  // ES: Guardar los permisos
  _.forEach(roles, (role) => {
    if (rolePermissionType[role]) {
      const data = _.map(permissions[role], (permissionName) => ({
        actionNames: ['view'],
        target: categoryId,
        permissionName,
      }));

      ctx.tx.call('users.permissions.addItem', {
        item: id,
        type: ctx.prefixPN(rolePermissionType[role]),
        data,
        isCustomPermission: true,
      });
    }
  });
}
module.exports = { addPermissionsToAsset };
