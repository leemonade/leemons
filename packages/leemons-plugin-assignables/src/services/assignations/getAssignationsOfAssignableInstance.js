const getUserPermission = require('../assignableInstance/permissions/assignableInstance/users/getUserPermission');
const { assignations } = require('../tables');
const getAssignation = require('./getAssignation');

module.exports = async function getAssignationsOfAssignableInstance(
  assignableInstance,
  { details = false, userSession, transacting } = {}
) {
  const userPermission = await getUserPermission(assignableInstance, { userSession, transacting });

  if (!userPermission.actions.includes('edit')) {
    throw new Error('You do not have permissions');
  }

  const query = { instance: assignableInstance };

  const studentsAssignations = await assignations.find(query, { transacting });

  if (details) {
    return Promise.all(
      studentsAssignations.map(async ({ user }) =>
        getAssignation(assignableInstance, user, { transacting, userSession })
      )
    );
  }

  return studentsAssignations.map((assignation) => ({
    ...assignation,
    classes: JSON.parse(assignation.classes),
    metadata: JSON.parse(assignation.metadata),
  }));
};
