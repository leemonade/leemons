/* eslint-disable no-param-reassign */

const { LeemonsError } = require('@leemons/error');

async function setInstanceFeedback({ instanceId, userAgent, feedback, ctx }) {
  const permissions = await ctx.tx.call('assignables.assignableInstances.getUserPermission', {
    assignableInstance: instanceId,
  });

  const isTeacher = permissions.actions.includes('edit');

  if (!isTeacher) {
    throw new LeemonsError(ctx, { message: 'Only teachers can set feedback' });
  }

  return ctx.tx.db.UserFeedback.findOneAndUpdate(
    {
      instance: instanceId,
      toUserAgent: userAgent,
    },
    {
      instance: instanceId,
      toUserAgent: userAgent,
      fromUserAgent: ctx.meta.userSession.userAgents[0].id,
      feedback,
    },
    { upsert: true, new: true, lean: true }
  );
}

module.exports = { setInstanceFeedback };
