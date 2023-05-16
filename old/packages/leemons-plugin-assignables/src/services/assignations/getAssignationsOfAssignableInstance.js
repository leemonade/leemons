const getUserPermissions = require('../assignableInstance/permissions/assignableInstance/users/getUserPermissions');
const { assignations } = require('../tables');
const getAssignations = require('./getAssignations');

module.exports = async function getAssignationsOfAssignableInstance(
  instances,
  { details = false, userSession, transacting } = {}
) {
  const ids = Array.isArray(instances) ? instances : [instances];

  const permissions = await getUserPermissions(ids, { userSession, transacting });

  if (!Object.values(permissions).every((permission) => permission.actions.includes('edit'))) {
    throw new Error('You do not have permissions');
  }

  const query = { instance_$in: ids };

  const studentsAssignations = await assignations.find(query, {
    columns: details ? ['id'] : undefined,
    transacting,
  });

  if (details) {
    const studentsAssignationPerInstance = {};
    const assignationsDetails = await getAssignations(studentsAssignations, {
      throwOnMissing: false,
      userSession,
      transacting,
    });

    assignationsDetails.forEach((assignation) => {
      if (!studentsAssignationPerInstance[assignation.instance]) {
        studentsAssignationPerInstance[assignation.instance] = [assignation];
      } else {
        studentsAssignationPerInstance[assignation.instance].push(assignation);
      }
    });

    return studentsAssignationPerInstance;
  }

  const studentsAssignationPerInstance = {};

  studentsAssignations.forEach((assignation) => {
    const assignationObj = {
      ...assignation,
      classes: JSON.parse(assignation.classes),
      metadata: JSON.parse(assignation.metadata),
    };

    if (!studentsAssignationPerInstance[assignation.instance]) {
      studentsAssignationPerInstance[assignation.instance] = [assignationObj];
    } else {
      studentsAssignationPerInstance[assignation.instance].push(assignationObj);
    }
  });

  if (!Array.isArray(instances)) {
    return studentsAssignationPerInstance[instances];
  }

  return studentsAssignationPerInstance;
};
