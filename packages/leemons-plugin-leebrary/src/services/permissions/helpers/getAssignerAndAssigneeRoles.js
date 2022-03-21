const { getByAsset } = require('../getByAsset');

module.exports = async function getAssignerAndAssigneeRoles(
  assetId,
  assignerSession,
  assigneeId,
  { transacting } = {}
) {
  // EN: Get assigner role
  // ES: Obtener rol del asignador
  const { role: assignerRole } = await getByAsset(assetId, {
    userSession: assignerSession,
    transacting,
  });

  // EN: Get assignee role
  // ES: Obtener rol del asignado
  const { role: assigneeRole } = await getByAsset(assetId, {
    userSession: {
      userAgents: [{ id: assigneeId }],
    },
    transacting,
  });

  return {
    assignerRole,
    assigneeRole,
  };
};
