async function createAssignation(
  assignableInstanceId,
  users,
  options,
  { userSession, transacting: t, ctx } = {}
) {
  //! Solo encabezamiento para que no den error los test
}

module.exports = { createAssignation };
