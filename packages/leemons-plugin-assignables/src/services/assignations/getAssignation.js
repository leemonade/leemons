const _ = require('lodash');
const dayjs = require('dayjs');
const { getDates } = require('../dates');
const { assignations, assignableInstances } = require('../tables');
const getGrade = require('../grades/getGrade');
const getUserPermission = require('../assignableInstance/permissions/assignableInstance/users/getUserPermission');
const getSubjects = require('../subjects/getSubjects');

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

  let [assignation, { assignable }] = await Promise.all([
    assignations.findOne(
      {
        instance: assignableInstanceId,
        user,
      },
      { transacting }
    ),
    assignableInstances.findOne(
      { id: assignableInstanceId },
      { columns: ['assignable'], transacting }
    ),
  ]);

  if (!assignation) {
    throw new Error('Assignation not found or your are not allowed to view it');
  }

  const [instanceDates, subjects] = await Promise.all([
    getDates('assignableInstance', assignableInstanceId, {
      transacting,
    }),
    getSubjects(assignable, { transacting }),
  ]);

  const chatKeys = [];
  _.forEach(subjects, ({ subject }) => {
    chatKeys.push(
      `plugins.assignables.subject|${subject}.assignation|${assignation.id}.userAgent|${user}`
    );
  });

  assignation = {
    ...assignation,
    classes: JSON.parse(assignation.classes),
    metadata: JSON.parse(assignation.metadata),
  };

  const [timestamps, grades] = await Promise.all([
    getDates('assignation', assignation.id, { transacting }),
    getGrade(
      { assignation: assignation.id, visibleToStudent: isTheStudent ? true : undefined },
      { transacting }
    ),
    /*
        leemons
          .getPlugin('comunica')
          .services.room.getUnreadMessages(chatKeys, userSession.userAgents[0].id, { transacting }),
    */
  ]);

  assignation.chatKeys = chatKeys;
  // assignation.unreadMessages = unreadMessages;
  assignation.timestamps = timestamps;
  assignation.grades = grades;

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

  if ((startDate.isValid() && !startDate.isAfter(today)) || !startDate.isValid()) {
    assignation.started = true;
  } else {
    assignation.started = false;
  }

  return assignation;
};
