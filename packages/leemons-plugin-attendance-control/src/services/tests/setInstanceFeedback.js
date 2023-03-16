/* eslint-disable no-param-reassign */
const { table } = require('../tables');

async function setInstanceFeedback(
  instanceId,
  userAgent,
  feedback,
  { userSession, transacting } = {}
) {
  const { assignableInstances: assignableInstancesService } =
    leemons.getPlugin('assignables').services;

  const permissions = await assignableInstancesService.getUserPermission(instanceId, {
    userSession,
    transacting,
  });
  const isTeacher = permissions.actions.includes('edit');

  if (!isTeacher) {
    throw new Error('Only teachers can set feedback');
  }

  return table.userFeedback.set(
    {
      instance: instanceId,
      toUserAgent: userAgent,
    },
    {
      instance: instanceId,
      toUserAgent: userAgent,
      fromUserAgent: userSession.userAgents[0].id,
      feedback,
    }
  );
}

module.exports = { setInstanceFeedback };
