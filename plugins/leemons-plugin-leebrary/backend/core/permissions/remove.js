const { tables } = require('../tables');
const canUnassignRole = require('./helpers/canUnassignRole');
const getAssignerAndAssigneeRoles = require('./helpers/getAssignerAndAssigneeRoles');
// const isAssetOwner = require('./helpers/isAssetOwner');

async function remove(assetId, assigneeAgent, { userSession, transacting } = {}) {
  try {
    // EN: Get assigner and assignee roles
    // ES: Obtener los roles del asignador y del asignado
    const { assignerRole, assigneeRole } = await getAssignerAndAssigneeRoles(
      assetId,
      userSession,
      assigneeAgent,
      { transacting }
    );

    // EN: Check if assigner can remove role from assignee
    // ES: Comprobar si el asignador puede eliminar el rol del asignado
    if (!canUnassignRole(assignerRole, assigneeRole, null)) {
      throw new global.utils.HttpError(401, "You don't have permission to remove this role");
    }

    // EN: Remove role
    // ES: Eliminar rol
    return await tables.permissions.deleteMany(
      {
        asset: assetId,
        userAgent: assigneeAgent,
      },
      { transacting }
    );
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to delete role: ${e.message}`);
  }
}
module.exports = { remove };
