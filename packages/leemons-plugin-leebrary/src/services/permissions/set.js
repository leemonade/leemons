/* eslint-disable no-inner-declarations */
/* eslint-disable no-await-in-loop */
const { map, uniq, filter, forEach, isArray } = require('lodash');
const _ = require('lodash');
const { validateSetPermissions } = require('../../validations/forms');
const { getByIds } = require('../assets/getByIds');
const { getByAsset } = require('./getByAsset');
const canAssignRole = require('./helpers/canAssignRole');
const validateRole = require('./helpers/validateRole');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');
const { update: updateAsset } = require('../assets/update');
const { getByAssets } = require('./getByAssets');
const canUnassignRole = require('./helpers/canUnassignRole');

const rolePermissionType = {
  viewer: leemons.plugin.prefixPN(`asset.can-view`),
  editor: leemons.plugin.prefixPN(`asset.can-edit`),
  assigner: leemons.plugin.prefixPN(`asset.can-assign`),
};

function checkIfRolesExists(canAccess, permissions) {
  const roles = [];
  if (canAccess.length) {
    roles.push(..._.map(canAccess, 'role'));
  }
  if (permissions) {
    roles.push(...Object.keys(permissions));
  }

  _.forEach(_.uniq(roles), (role) => {
    if (!validateRole(role)) {
      throw new global.utils.HttpError(412, `Invalid role: ${role}}`);
    }
  });
}

async function addPermissionsToUserAgent({
  id,
  role,
  userAgent,
  categoryId,
  userSession,
  transacting,
  userService,
  assignerRole,
  permissionName,
}) {
  const result = [];
  const { canAccessRole: assigneeRole } = await getByAsset(id, {
    userSession: {
      userAgents: [{ id: userAgent }],
    },
    transacting,
  });

  if (assigneeRole === role) return [];

  // EN: Check if assigner can assign role to assignee
  // ES: Comprobar si el asignador puede asignar el rol al asignado
  if (!canAssignRole(assignerRole, assigneeRole, role)) {
    throw new global.utils.HttpError(401, "You don't have permission to assign this role");
  }

  // EN: When assigning owner role, replace current owner role by editor role
  // ES: Cuando se asigna el rol de propietario, reemplazar el rol de propietario actual por el rol de editor
  if (role === 'owner' && assignerRole === 'owner') {
    // First, remove all permissions to the asset
    await userService.permissions.removeCustomUserAgentPermission(
      map(userSession.userAgents, 'id'),
      {
        permissionName,
      },
      { transacting }
    );

    // Then, add editor permission to the asset
    result.push(
      await userService.permissions.addCustomPermissionToUserAgent(
        map(userSession.userAgents, 'id'),
        {
          permissionName,
          actionNames: ['editor'],
          target: categoryId,
        },
        { transacting }
      )
    );
  }

  // First, remove all permissions to the asset
  await userService.permissions.removeCustomUserAgentPermission(
    userAgent,
    {
      permissionName,
    },
    { transacting }
  );

  try {
    // EN: Set role
    // ES: Asignar rol
    result.push(
      await userService.permissions.addCustomPermissionToUserAgent(
        userAgent,
        {
          permissionName,
          actionNames: [role],
          target: categoryId,
        },
        { transacting }
      )
    );
  } catch (e) {
    leemons.log.info(`Cannot assign custom permissions to UserAgent ${userAgent}: ${e.message}`);
  }
  return result;
}

async function addPermissionsToAsset({
  id,
  categoryId,
  permissions,
  userService,
  transacting,
  assignerRole,
}) {
  const roles = Object.keys(permissions);
  const allPermissions = [];
  // ES: Añadimos todos los permisos que queremos añadir a un array para despues consultar cuales de todos los permisos que queremos añadir ya tenemos actualmente
  _.forEach(roles, (role) => {
    allPermissions.push(...permissions[role]);
  });
  const currentPermissions = await userService.permissions.findItems(
    {
      item: id,
      permissionName_$in: allPermissions,
      type_$startsWith: leemons.plugin.prefixPN('asset'),
    },
    { transacting }
  );
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
      if (!canAssignRole(assignerRole, oldRole, role)) {
        throw new global.utils.HttpError(
          401,
          `You don't have permission to assign the permission "${permission}" with role "${role}"`
        );
      }
    });
  });

  // EN: Remove existing permissions
  // ES: Eliminar permisos de existentes
  await userService.permissions.removeItems(
    {
      type_$in: [
        leemons.plugin.prefixPN('asset.can-edit'),
        leemons.plugin.prefixPN('asset.can-view'),
        leemons.plugin.prefixPN('asset.can-assign'),
      ],
      item: id,
      permissionName_$in: allPermissions,
    },
    { transacting }
  );

  // EN: Save permissions
  // ES: Guardar los permisos
  const permissionsPromises = [];
  _.forEach(roles, (role) => {
    if (rolePermissionType[role]) {
      permissionsPromises.push(
        userService.permissions.addItem(
          id,
          rolePermissionType[role],
          _.map(permissions[role], (permissionName) => ({
            actionNames: ['view'],
            target: categoryId,
            permissionName,
          })),
          { transacting, isCustomPermission: true }
        )
      );
    }
  });
}

async function removeMissingUserAgent({
  id,
  userAgent,
  transacting,
  userService,
  assignerRole,
  permissionName,
}) {
  const { canAccessRole: assigneeRole } = await getByAsset(id, {
    userSession: {
      userAgents: [{ id: userAgent }],
    },
    transacting,
  });

  // EN: Check if assigner can assign role to assignee
  // ES: Comprobar si el asignador puede asignar el rol al asignado
  if (assigneeRole !== 'owner') {
    if (!canUnassignRole(assignerRole, assigneeRole)) {
      throw new global.utils.HttpError(401, "You don't have permission to unassign this role");
    }

    // Remove all permissions to the asset
    await userService.permissions.removeCustomUserAgentPermission(
      userAgent,
      {
        permissionName,
      },
      { transacting }
    );
  }
}

async function removeMissingUserAgents({
  id,
  toUpdate,
  transacting,
  userService,
  assignerRole,
  permissionName,
  currentUserAgentIds,
}) {
  let toRemove = await userService.permissions.findUserAgentsWithPermission({
    permissionName,
  });
  toRemove = toRemove.filter((ua) => !toUpdate.includes(ua));

  const removePromises = [];
  _.forEach(toRemove, (userAgent) => {
    if (!currentUserAgentIds.includes(userAgent)) {
      removePromises.push(
        removeMissingUserAgent({
          id,
          userAgent,
          transacting,
          userService,
          assignerRole,
          permissionName,
        })
      );
    }
  });
  if (removePromises.length) await Promise.all(removePromises);
}

async function removeMissingPermissions({
  id,
  permissions,
  userService,
  assignerRole,
  transacting,
}) {
  const newRoles = Object.keys(permissions);
  const allPermissions = [];
  // ES: Añadimos todos los permisos que queremos añadir a un array para despues consultar cuales de todos los permisos que queremos añadir ya tenemos actualmente
  _.forEach(newRoles, (role) => {
    allPermissions.push(...permissions[role]);
  });

  // EN: Get all permissions that were assigned
  // ES: Obtener todas los permisos que estaban asignados
  const oldPermissions = await userService.permissions.findItems(
    {
      item: id,
      permissionName_$nin: allPermissions,
      type_$startsWith: leemons.plugin.prefixPN('asset'),
    },
    { transacting }
  );

  // EN: Check that all permissions can be unassigned
  // ES: Comprobar que todos los permisos se pueden desasignar
  const roles = uniq(
    oldPermissions.map((permission) => {
      let role = 'viewer';
      if (permission.type === leemons.plugin.prefixPN('asset.can-edit')) {
        role = 'editor';
      }
      if (permission.type === leemons.plugin.prefixPN('asset.can-assign')) {
        role = 'assigner';
      }

      return role;
    })
  );
  roles.forEach((role) => {
    if (!canUnassignRole(assignerRole, role)) {
      throw new global.utils.HttpError(
        401,
        `You don't have permission to unassign this role: ${role}`
      );
    }
  });

  // EN: Remove old permissions
  // ES: Eliminar los permisos antiguos
  const promises = [];
  _.forEach(newRoles, (role) => {
    promises.push(
      userService.permissions.removeItems(
        {
          item: id,
          permissionName_$nin: permissions[role],
          type: rolePermissionType[role],
        },
        { transacting }
      )
    );
  });

  await Promise.all(promises);
}

/**
 * Set userAgents permissions / roles in order to access to the specified assetID
 * @public
 * @static
 * @param {string} assetId - Asset ID
 * @param {any=} isPublic, canAccess - Array of { userAgent: string, role: string }
 * @param {any=} transacting - DB Transaction
 * @return {Promise<string[]>}
 * */
async function set(
  assetId,
  { isPublic, permissions, canAccess, deleteMissing },
  { userSession, transacting } = {}
) {
  try {
    const { services: userService } = leemons.getPlugin('users');

    const assetIds = _.isArray(assetId) ? assetId : [assetId];
    await validateSetPermissions({ assets: assetIds, permissions, canAccess, isPublic });

    // ES: Comprobamos si los roles que se quieren usar existen
    checkIfRolesExists(canAccess, permissions);

    // ES: Sacamos que rol (viewer|editor|owner) tiene el usuario actual para el asset que quiere actualizar
    const [assetsRole, assetsData] = await Promise.all([
      getByAssets(assetIds, { userSession, transacting }),
      getByIds(assetIds, { userSession }),
    ]);

    const assetsDataById = _.keyBy(assetsData, 'id');
    const assetsRoleById = {};
    _.forEach(assetsRole, (assetRole) => {
      assetsRoleById[assetRole.asset] = assetRole.role;
    });

    // ES: Comprobamos que el usuario actual tiene permisos para actualizar los assets
    _.forEach(assetIds, (id) => {
      if (assetsRoleById[id] !== 'owner' && (isPublic || assetsDataById[id].public)) {
        throw new global.utils.HttpError(412, 'Only owner can set public permissions');
      }
    });

    // ES: Actualizamos los permisos del asset para que sea publico si hace falta
    const updatePromises = [];
    _.forEach(assetIds, async (id) => {
      if (isPublic || assetsDataById[id].public) {
        updatePromises.push(
          updateAsset({ ...assetsDataById[id], public: isPublic }, { userSession, transacting })
        );
      }
    });

    if (updatePromises.length) {
      await Promise.all(updatePromises);
    }

    if (canAccess?.length) {
      const currentUserAgentIds = _.map(userSession.userAgents, 'id');

      const userPromises = [];
      _.forEach(assetIds, (id) => {
        const categoryId = assetsDataById[id]?.category;
        const assignerRole = assetsRoleById[id];
        const permissionName = getAssetPermissionName(id);
        _.forEach(canAccess, ({ userAgent, role }) => {
          if (!currentUserAgentIds.includes(userAgent)) {
            userPromises.push(
              addPermissionsToUserAgent({
                id,
                role,
                userAgent,
                categoryId,
                transacting,
                userSession,
                userService,
                assignerRole,
                permissionName,
              })
            );
          }
        });
      });

      if (userPromises.length) await Promise.all(userPromises);
    }

    if (permissions) {
      const assetPromises = [];
      _.forEach(assetIds, (id) => {
        const categoryId = assetsDataById[id]?.category;
        const assignerRole = assetsRoleById[id];
        assetPromises.push(
          addPermissionsToAsset({
            id,
            categoryId,
            permissions,
            userService,
            transacting,
            assignerRole,
          })
        );
      });

      if (assetPromises.length) await Promise.all(assetPromises);
    }

    if (deleteMissing) {
      const currentUserAgentIds = _.map(userSession.userAgents, 'id');
      const toUpdate = map(canAccess, 'userAgent');

      const missingPromises = [];
      _.forEach(assetIds, (id) => {
        const assignerRole = assetsRoleById[id];
        const permissionName = getAssetPermissionName(id);
        missingPromises.push(
          removeMissingUserAgents({
            id,
            toUpdate,
            transacting,
            userService,
            assignerRole,
            permissionName,
            currentUserAgentIds,
          })
        );
        missingPromises.push(
          removeMissingPermissions({ id, permissions, userService, assignerRole, transacting })
        );
      });
      if (missingPromises.length) await Promise.all(missingPromises);
    }

    return true;
  } catch (e) {
    console.error(e);
    throw e;
    // throw new global.utils.HttpError(400, `Failed to set permissions: ${e.message}`);
  }
}

module.exports = { set };
