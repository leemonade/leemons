const dayjs = require('dayjs');
const { getDates } = require('../dates');
const { assignations } = require('../tables');
const getGrade = require('../grades/getGrade');
const getUserPermission = require('../assignableInstance/permissions/assignableInstance/users/getUserPermission');

module.exports = async function getAssignation(
  assignableInstanceId,
  user,
  { userSession, transacting } = {}
) {
  // EN: Check permissions (or teacher or student)
  // ES: Comprueba permisos (o profesor o estudiante)
  const isTheStudent = userSession.userAgents.map((u) => u.id).includes(user);
  if (
    !(
      isTheStudent ||
      (
        await getUserPermission(assignableInstanceId, { userSession, transacting })
      ).actions.includes('edit')
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

  const instanceDates = await getDates('assignableInstance', assignableInstanceId, {
    transacting,
  });

  assignation = {
    ...assignation,
    classes: JSON.parse(assignation.classes),
    metadata: JSON.parse(assignation.metadata),
  };

  assignation.timestamps = await getDates('assignation', assignation.id, { transacting });
  assignation.grades = await getGrade(
    { assignation: assignation.id, visibleToStudent: isTheStudent ? true : undefined },
    { transacting }
  );

  const today = dayjs();
  const startDate = dayjs(instanceDates.start || null);
  const deadline = dayjs(instanceDates.deadline || null);
  const closeDate = dayjs(instanceDates.close || null);
  const closedDate = dayjs(instanceDates.closed || null);

  if (
    assignation.timestamps.end ||
    (deadline.isValid() && !deadline.isAfter(today)) ||
    (closeDate.isValid() && !closeDate.isAfter(today)) ||
    (closedDate.isValid() && !closedDate.isAfter(today))
  ) {
    assignation.finished = true;
  } else {
    assignation.finished = false;
  }

  if (startDate.isValid() && !startDate.isAfter(today)) {
    assignation.started = true;
  } else {
    assignation.started = false;
  }

  return assignation;
};
