const { uniq, forEach, escapeRegExp } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const canUnassignRole = require('../helpers/canUnassignRole');

const rolePermissionType = {
  editor: 'asset.can-edit',
  viewer: 'asset.can-view',
  assigner: 'asset.can-assign',
};

/**
 * This function removes missing permissions.
 * @param {Object} params - The parameters for the function.
 * @param {string} params.id - The id of the asset involved.
 * @param {Object} params.permissions - The permissions that should remain after removing everything else.
 * @param {string} params.assignerRole - The role of the assigner.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<undefined>} - A promise that resolves when all missing permissions have been removed.
 */

async function removeMissingPermissions({ id, permissions, assignerRole, ctx }) {
  const newRoles = Object.keys(permissions);
  const allPermissions = [];
  // ES: Añadimos todos los permisos que queremos añadir a un array para despues consultar cuales de todos los permisos que queremos añadir ya tenemos actualmente
  forEach(newRoles, (role) => {
    allPermissions.push(...permissions[role]);
  });

  // EN: Get all permissions that were assigned
  // ES: Obtener todas los permisos que estaban asignados
  const oldPermissions = await ctx.tx.call('users.permissions.findItems', {
    params: {
      item: id,
      permissionName: { $nin: allPermissions },
      type: { $regex: `^${escapeRegExp(ctx.prefixPN('asset'))}` },
    },
  });

  // EN: Check that all permissions can be unassigned
  // ES: Comprobar que todos los permisos se pueden desasignar
  const roles = uniq(
    oldPermissions.map((permission) => {
      let role = 'viewer';
      if (permission.type === ctx.prefixPN('asset.can-edit')) {
        role = 'editor';
      }
      if (permission.type === ctx.prefixPN('asset.can-assign')) {
        role = 'assigner';
      }

      return role;
    })
  );
  roles.forEach((role) => {
    if (!canUnassignRole({ userRole: assignerRole, assignedUserCurrentRole: role, ctx })) {
      throw new LeemonsError(ctx, {
        message: `You don't have permission to unassign this role: ${role}`,
        httpStatusCode: 401,
      });
    }
  });

  // EN: Remove old permissions
  // ES: Eliminar los permisos antiguos
  const promises = [];
  forEach(newRoles, (role) => {
    promises.push(
      ctx.tx.call('users.permissions.removeItems', {
        query: {
          item: id,
          permissionName: { $nin: permissions[role] },
          type: ctx.prefixPN(rolePermissionType[role]),
        },
      })
    );
  });

  await Promise.all(promises);
}

module.exports = { removeMissingPermissions };
