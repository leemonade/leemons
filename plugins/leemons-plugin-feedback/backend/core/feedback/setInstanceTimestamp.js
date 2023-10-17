/* eslint-disable no-param-reassign */

async function setInstanceTimestamp({ instanceId, timeKey, user, ctx }) {
  const { userSession } = ctx.meta;

  if ((timeKey === 'start' || timeKey === 'end') && user === userSession.userAgents[0].id) {
    const date = await ctx.tx.db.FeedbackDates.findOne({
      userAgent: user,
      instance: instanceId,
    }).lean();
    if (!date && timeKey === 'start') {
      await ctx.tx.db.FeedbackDates.create({
        instance: instanceId,
        userAgent: user,
        startDate: new Date(),
      });
    }
    if (date && date.startDate && timeKey === 'end' && !date.endDate) {
      const endDate = new Date();
      await ctx.tx.db.FeedbackDates.updateOne(
        { id: date.id },
        {
          endDate,
          timeToFinish: endDate - date.startDate,
        }
      );
    }
  }

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

module.exports = setInstanceTimestamp;
