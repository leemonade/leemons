/* eslint-disable no-param-reassign */
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { table } = require('../tables');
const { findQuestionResponses } = require('./findQuestionResponses');

dayjs.extend(duration);

async function setQuestionResponse(data, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { assignations: assignationsService, assignableInstances: assignableInstancesService } =
        leemons.getPlugin('assignables').services;

      const [{ timestamps }, [questionResponse], instance] = await Promise.all([
        assignationsService.getAssignation(data.instance, userSession.userAgents[0].id, {
          userSession,
          transacting,
        }),
        findQuestionResponses(
          {
            instance: data.instance,
            question: data.question,
            userAgent: userSession.userAgents[0].id,
          },
          { transacting }
        ),
        assignableInstancesService.getAssignableInstance(data.instance, {
          userSession,
          transacting,
        }),
      ]);

      if (questionResponse) {
        // Check if the data clues is less than the question response
        if (data.clues < questionResponse.clues) {
          throw new Error('The track cannot be smaller than the one already stored.');
        }
      } else if (data.clues > 1) {
        throw new Error('The track cannot be greater than 1.');
      }

      if (instance.duration) {
        // Check if not exceeding the duration
        const [value, unit] = instance.duration.split(' ');
        const seconds = dayjs.duration({ [unit]: value }).asSeconds();
        const start = new Date(timestamps.start);
        start.setSeconds(start.getSeconds() + seconds);
        if (new Date() > start) {
          // throw new global.utils.HttpErrorWithCustomCode(400, 7001, 'Time used up');
        }
      }

      const a = {
        assignableInstance: 'instance id',
        user: 'user agent id',
        grades: [
          {
            subject: 'id',
            type: 'main',
            grade: 'la nota',
            gradedBy: 'auto-graded',
          },
        ],
      };

      return table.userAgentAssignableInstanceResponses.set(
        {
          instance: data.instance,
          question: data.question,
          userAgent: userSession.userAgents[0].id,
        },
        {
          ...data,
          userAgent: userSession.userAgents[0].id,
          properties: JSON.stringify(data.properties),
        },
        { transacting }
      );
    },
    table.userAgentAssignableInstanceResponses,
    _transacting
  );
}

module.exports = { setQuestionResponse };
