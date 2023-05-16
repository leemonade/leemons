const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { table } = require('../tables');

dayjs.extend(duration);

async function setQuestionResponse(data, { userSession, transacting: _transacting } = {}) {
  const { assignations: assignationsService, assignableInstances: assignableInstancesService } =
    leemons.getPlugin('assignables').services;

  return global.utils.withTransaction(
    async (transacting) => {
      const { questionId, instanceId, value } = data;

      const [{ timestamps, finished }, instance] = await Promise.all([
        assignationsService.getAssignation(instanceId, userSession.userAgents[0].id, {
          userSession,
          transacting,
        }),
        assignableInstancesService.getAssignableInstance(instanceId, {
          userSession,
          details: true,
          transacting,
        }),
      ]);

      if (finished) {
        throw new Error('Assignation finished');
      }

      if (instance.duration) {
        // Check if not exceeding the duration
        const [_value, unit] = instance.duration.split(' ');
        const seconds = dayjs.duration({ [unit]: _value }).asSeconds();
        const start = new Date(timestamps.start);
        start.setSeconds(start.getSeconds() + seconds);
        if (new Date() > start) {
          throw new global.utils.HttpErrorWithCustomCode(400, 7001, 'Time used up');
        }
      }

      const response = await table.feedbackResponse.set(
        { question: questionId, instance: instanceId, userAgent: userSession.userAgents[0].id },
        {
          response: JSON.stringify(value),
          question: questionId,
          instance: instanceId,
          userAgent: userSession.userAgents[0].id,
        },
        { transacting }
      );

      return response;
    },
    table.feedbackResponse,
    _transacting
  );
}

module.exports = setQuestionResponse;
