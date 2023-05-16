const { getByAsset } = require('../getByAsset');

module.exports = async function getAssignerAndAssigneeRoles(
  assetId,
  assignerSession,
  assigneeId,
  { transacting } = {}
) {
  const permissions = await Promise.all([
    // EN: Get assigner role
    // ES: Obtener rol del asignador
    getByAsset(assetId, {
      userSession: assignerSession,
      transacting,
    }),
    // EN: Get assignee role
    // ES: Obtener rol del asignado
    getByAsset(assetId, {
      userSession: {
        userAgents: [{ id: assigneeId }],
      },
      transacting,
    }),
  ]);

  return {
    assignerRole: permissions[0].role,
    assigneeRole: permissions[1].role,
  };
};
