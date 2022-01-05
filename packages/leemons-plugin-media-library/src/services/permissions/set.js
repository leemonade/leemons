const { permissions: table } = require('../tables');
const assetHasOwner = require('./helpers/assetHasOwner');
const canAssignRole = require('./helpers/canAssignRole');
const getAssignerAndAssigneeRoles = require('./helpers/getAssignerAndAssigneeRoles');
const validateRole = require('./helpers/validateRole');

module.exports = async function set(asset, userAgent, role, { userSession, transacting } = {}) {
  try {
    if (!validateRole(role)) {
      throw new Error('Invalid role');
    }

    // EN: Get the assigner and assignee roles
    // ES: Obtener los roles del asignador y del asignado
    const { assignerRole, assigneeRole } = await getAssignerAndAssigneeRoles(
      asset,
      userSession,
      userAgent,
      { transacting }
    );

    // EN: Check if assigner can assign role to assignee
    // ES: Comprobar si el asignador puede asignar el rol al asignado
    if (!canAssignRole(assignerRole, assigneeRole, role)) {
      if (!(role === 'owner' && !(await assetHasOwner(asset, { transacting })))) {
        throw new Error("You don't have permission to assign this role");
      }
    }

    // EN: When assigning owner role, replace current owner role by editor role
    // ES: Cuando se asigna el rol de propietario, reemplazar el rol de propietario actual por el rol de editor
    if (role === 'owner') {
      await table.set(
        {
          asset,
          userAgent: userSession.userAgents[0].id,
        },
        {
          role: 'editor',
        }
      );
    }

    // EN: Set role
    // ES: Asignar rol
    await table.set(
      {
        asset,
        userAgent,
      },
      {
        role,
      },
      { transacting }
    );

    return true;
  } catch (e) {
    throw new Error(`Failed to set permissions: ${e.message}`);
  }
};
