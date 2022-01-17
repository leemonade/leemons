const { permissions: table } = require('../tables');
const canUnassignRole = require('./helpers/canUnassignRole');
const getAssignerAndAssigneeRoles = require('./helpers/getAssignerAndAssigneeRoles');
// const isAssetOwner = require('./helpers/isAssetOwner');

module.exports = async function remove(asset, assigneeAgent, { userSession, transacting } = {}) {
  try {
    // EN: Get assigner and assignee roles
    // ES: Obtener los roles del asignador y del asignado
    const { assignerRole, assigneeRole } = await getAssignerAndAssigneeRoles(
      asset,
      userSession,
      assigneeAgent,
      { transacting }
    );

    // EN: Check if assigner can remove role from assignee
    // ES: Comprobar si el asignador puede eliminar el rol del asignado
    if (!canUnassignRole(assignerRole, assigneeRole, null)) {
      throw new Error("You don't have permission to remove this role");
    }

    // EN: Remove role
    // ES: Eliminar rol
    return await table.deleteMany(
      {
        asset,
        userAgent: assigneeAgent,
      },
      { transacting }
    );
  } catch (e) {
    throw new Error(`Failed to delete role: ${e.message}`);
  }
};
