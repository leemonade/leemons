const getUserPermission = require('../assignableInstance/permissions/assignableInstance/users/getUserPermission');
const { assignations } = require('../tables');

module.exports = async function getAssignationsOfAssignableInstance(
  assignableInstance,
  { userSession, transacting } = {}
) {
  const userPermission = await getUserPermission(assignableInstance, { userSession, transacting });

  if (!userPermission.actions.includes('edit')) {
    throw new Error('You do not have permissions');
  }

  const query = { instance: assignableInstance };

  const studentsAssignations = await assignations.findOne(query, { transacting });

  studentsAssignations.map((assignation) => ({
    ...assignation,
    classes: JSON.parse(assignation.classes),
    metadata: JSON.parse(assignation.metadata),
  }));
};
