/* eslint-disable no-param-reassign */

async function setInstanceTimestamp({ instanceId, timeKey, user, ctx }) {
  const { userSession } = ctx.meta;

  const asignation = await ctx.tx.call('assignables.assignations.getAssignation', {
    assignableInstanceId: instanceId,
    user,
  });

  if (!asignation.timestamps[timeKey] && user === userSession.userAgents[0].id) {
    return ctx.tx.call('assignables.assignations.updateAssignation', {
      assignation: {
        assignableInstance: instanceId,
        user: userSession.userAgents[0].id,
        timestamps: { ...asignation.timestamps, [timeKey]: new Date() },
      },
    });
  }

  return asignation;
}

module.exports = { setInstanceTimestamp };
