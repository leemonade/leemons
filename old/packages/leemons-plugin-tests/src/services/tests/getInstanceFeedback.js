/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

async function getInstanceFeedback(instanceId, userAgent, { userSession, transacting } = {}) {
  const { assignableInstances: assignableInstancesService } =
    leemons.getPlugin('assignables').services;

  const permissions = await assignableInstancesService.getUserPermission(instanceId, {
    userSession,
    transacting,
  });
  if (!permissions.actions.includes('view')) {
    throw new Error('You do not have permissions');
  }

  const isTeacher = permissions.actions.includes('edit');

  const userAgentIds = _.map(userSession.userAgents, 'id');

  if (!isTeacher) {
    if (!userAgentIds.includes(userAgent)) {
      throw new Error('You only have permission to show your own feedback');
    }
  }

  const result = await table.userFeedback.findOne({
    instance: instanceId,
    toUserAgent: userAgent,
  });

  return {
    isTeacher,
    feedback: result?.feedback,
  };
}

module.exports = { getInstanceFeedback };
