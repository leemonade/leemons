const { getDates } = require('../dates');
const { assignations } = require('../tables');
const getGrade = require('../grades/getGrade');
const getTeacherPermission = require('../assignableInstance/permissions/assignableInstance/users/getTeacherPermission');

module.exports = async function getAssignation(
  assignableInstanceId,
  user,
  { userSession, transacting } = {}
) {
  // EN: Check permissions (or teacher or student)
  // ES: Comprueba permisos (o profesor o estudiante)
  if (
    !(
      userSession.userAgents.map((u) => u.id).includes(user) ||
      (await getTeacherPermission(assignableInstanceId, { userSession, transacting })).length
    )
  ) {
    throw new Error('Assignation not found or your are not allowed to view it');
  }

  let assignation = await assignations.findOne(
    {
      instance: assignableInstanceId,
      user,
    },
    { transacting }
  );

  if (!assignation) {
    throw new Error('Assignation not found or your are not allowed to view it');
  }

  assignation = {
    ...assignation,
    classes: JSON.parse(assignation.classes),
    metadata: JSON.parse(assignation.metadata),
  };

  assignation.timestamps = await getDates('assignation', assignation.id, { transacting });
  assignation.grades = await getGrade({ assignation: assignation.id }, { transacting });

  return assignation;
};
