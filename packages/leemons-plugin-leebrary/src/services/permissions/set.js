/* eslint-disable no-await-in-loop */
const { map } = require('lodash');
const { validateSetPermissions } = require('../../validations/forms');
const { getByIds } = require('../assets/getByIds');
const { getByAsset } = require('./getByAsset');
const canAssignRole = require('./helpers/canAssignRole');
const canUnassignRole = require('./helpers/canUnassignRole');
const validateRole = require('./helpers/validateRole');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');
const { update: updateAsset } = require('../assets/update');

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
  { isPublic, canAccess },
  { deleteMissing, userSession, transacting } = {}
) {
  try {
    await validateSetPermissions({ asset: assetId, canAccess, isPublic });

    if (!isPublic) {
      for (let i = 0, len = canAccess.length; i < len; i++) {
        const { role } = canAccess[i];
        if (!validateRole(role)) {
          throw new global.utils.HttpError(412, `Invalid role: ${role}}`);
        }
      }
    }

    // EN: Get the assigner and assignee roles
    // ES: Obtener los roles del asignador y del asignado
    const { role: assignerRole } = await getByAsset(assetId, { userSession, transacting });
    const [assetData] = await getByIds([assetId], { userSession });

    if (isPublic) {
      if (assignerRole === 'owner') {
        return updateAsset({ ...assetData, public: true }, { userSession, transacting });
      }
      throw new global.utils.HttpError(412, 'Only owner can set public permissions');
    } else if (assetData.public) {
      await updateAsset({ ...assetData, public: false }, { userSession, transacting });
    }

    const categoryId = assetData?.category;
    const permissionName = getAssetPermissionName(assetId);
    const { services: userService } = leemons.getPlugin('users');
    const result = [];

    for (let i = 0, len = canAccess.length; i < len; i++) {
      const { userAgent, role } = canAccess[i];

      // Skip iteration if user is whos calls
      if (map(userSession.userAgents, 'id').includes(userAgent)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const { role: assigneeRole } = await getByAsset(assetId, {
        userSession: {
          userAgents: [{ id: userAgent }],
        },
        transacting,
      });

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
        leemons.log.info(
          `Cannot assign custom permissions to UserAgent ${userAgent}: ${e.message}`
        );
      }
    }

    if (deleteMissing) {
      const toUpdate = map(canAccess, 'userAgent');
      let toRemove = await userService.permissions.findUserAgentsWithPermission({
        permissionName,
      });
      toRemove = toRemove.filter((ua) => !toUpdate.includes(ua));

      for (let i = 0, len = toRemove.length; i < len; i++) {
        const userAgent = toRemove[i];

        // Skip iteration if user is whos calls
        if (map(userSession.userAgents, 'id').includes(userAgent)) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const { role: assigneeRole } = await getByAsset(assetId, {
          userSession: {
            userAgents: [{ id: userAgent }],
          },
          transacting,
        });

        // EN: Check if assigner can assign role to assignee
        // ES: Comprobar si el asignador puede asignar el rol al asignado
        if (!canUnassignRole(assignerRole, assigneeRole, assigneeRole)) {
          throw new global.utils.HttpError(401, "You don't have permission to assign this role");
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

    return result;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to set permissions: ${e.message}`);
  }
}

module.exports = { set };
