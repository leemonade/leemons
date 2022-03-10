const get = require('../get');

module.exports = async function getAssignerAndAssigneeRoles(
  asset,
  assignerSession,
  assigneeId,
  { transacting } = {}
) {
  // EN: Get assigner role
  // ES: Obtener rol del asignador
  const { role: assignerRole } = await get(asset, {
    userSession: assignerSession,
    transacting,
  });

  // EN: Get assignee role
  // ES: Obtener rol del asignado
  const { role: assigneeRole } = await get(asset, {
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
