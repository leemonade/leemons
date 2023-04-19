const getAssignations = require('./getAssignations');

module.exports = async function getAssignation(
  assignableInstanceId,
  user,
  { userSession, transacting } = {}
) {
  const assignations = await getAssignations([{ instance: assignableInstanceId, user }], {
    userSession,
    transacting,
  });

  return assignations[0];
};
