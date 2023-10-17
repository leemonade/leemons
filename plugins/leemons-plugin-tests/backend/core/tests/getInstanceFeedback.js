/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

async function getInstanceFeedback({ instanceId, userAgent, ctx }) {
  const permissions = await ctx.tx.call('assignables.assignableInstances.getUserPermission', {
    assignableInstance: instanceId,
  });
  if (!permissions.actions.includes('view')) {
    throw new LeemonsError(ctx, { message: 'You do not have permissions' });
  }

  const isTeacher = permissions.actions.includes('edit');

  const userAgentIds = _.map(ctx.meta.userSession.userAgents, 'id');

  if (!isTeacher) {
    if (!userAgentIds.includes(userAgent)) {
      throw new LeemonsError(ctx, {
        message: 'You only have permission to show your own feedback',
      });
    }
  }

  const result = await ctx.tx.db.UserFeedback.findOne({
    instance: instanceId,
    toUserAgent: userAgent,
  })
    .select(['feedback'])
    .lean();

  return {
    isTeacher,
    feedback: result?.feedback,
  };
}

module.exports = { getInstanceFeedback };
