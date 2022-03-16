const { map } = require('lodash');
const canAssignRole = require('./helpers/canAssignRole');
const getAssignerAndAssigneeRoles = require('./helpers/getAssignerAndAssigneeRoles');
const validateRole = require('./helpers/validateRole');

async function set(assetId, userAgent, role, { userSession, transacting } = {}) {
  try {
    if (!validateRole(role)) {
      throw new global.utils.HttpError(412, 'Invalid role');
    }

    // EN: Get the assigner and assignee roles
    // ES: Obtener los roles del asignador y del asignado
    const { assignerRole, assigneeRole } = await getAssignerAndAssigneeRoles(
      assetId,
      userSession,
      userAgent,
      { transacting }
    );

    // EN: Check if assigner can assign role to assignee
    // ES: Comprobar si el asignador puede asignar el rol al asignado
    if (!canAssignRole(assignerRole, assigneeRole, role)) {
      throw new global.utils.HttpError(401, "You don't have permission to assign this role");
    }

    const { services: userService } = leemons.getPlugin('users');

    // EN: When assigning owner role, replace current owner role by editor role
    // ES: Cuando se asigna el rol de propietario, reemplazar el rol de propietario actual por el rol de editor
    if (role === 'owner' && assignerRole === 'owner') {
      // First, remove the permissions to the asset
      await userService.permissions.removeCustomUserAgentPermission(
        map(userSession.userAgents, 'id'),
        {
          permissionName: leemons.plugin.prefixPN(assetId),
        },
        { transacting }
      );

      // Then, add editor permission to the asset
      await userService.permissions.addCustomPermissionToUserAgent(
        map(userSession.userAgents, 'id'),
        {
          permissionName: leemons.plugin.prefixPN(assetId),
          actionNames: ['editor'],
        },
        { transacting }
      );
    }

    // EN: Set role
    // ES: Asignar rol
    await userService.permissions.addCustomPermissionToUserAgent(
      userAgent,
      {
        permissionName: leemons.plugin.prefixPN(assetId),
        actionNames: [role],
      },
      { transacting }
    );
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to set permissions: ${e.message}`);
  }
}

module.exports = { set };
