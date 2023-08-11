/* eslint-disable no-param-reassign */
const { table } = require('../tables');

async function setInstanceTimestamp(
  instanceId,
  timeKey,
  user,
  { userSession, transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { assignations: assignationsService } = leemons.getPlugin('assignables').services;

      if ((timeKey === 'start' || timeKey === 'end') && user === userSession.userAgents[0].id) {
        const date = await table.feedbackDates.findOne(
          { userAgent: user, instance: instanceId },
          { transacting }
        );
        if (!date && timeKey === 'start') {
          await table.feedbackDates.create(
            { instance: instanceId, userAgent: user, startDate: new Date() },
            { transacting }
          );
        }
        if (date && date.startDate && timeKey === 'end' && !date.endDate) {
          const endDate = new Date();
          await table.feedbackDates.update(
            { id: date.id },
            {
              endDate,
              timeToFinish: endDate - date.startDate,
            },
            { transacting }
          );
        }
      }

      const asignation = await assignationsService.getAssignation(instanceId, user, {
        userSession,
        transacting,
      });

      if (!asignation.timestamps[timeKey] && user === userSession.userAgents[0].id) {
        return assignationsService.updateAssignation(
          {
            assignableInstance: instanceId,
            user: userSession.userAgents[0].id,
            timestamps: { ...asignation.timestamps, [timeKey]: new Date() },
          },
          {
            userSession,
            transacting,
          }
        );
      }

      return asignation;
    },
    table.feedbackQuestions,
    _transacting
  );
}

module.exports = setInstanceTimestamp;
