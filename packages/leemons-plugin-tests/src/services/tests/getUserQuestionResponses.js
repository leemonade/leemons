/* eslint-disable no-param-reassign */
const _ = require('lodash');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { findQuestionResponses } = require('./findQuestionResponses');

dayjs.extend(duration);

async function getUserQuestionResponses(instance, userAgent, { userSession, transacting } = {}) {
  const { assignations: assignationsService } = leemons.getPlugin('assignables').services;

  await assignationsService.getAssignation(instance, userAgent, {
    userSession,
    transacting,
  });

  const responses = await findQuestionResponses(
    {
      instance,
      userAgent,
    },
    { columns: ['question', 'clues', 'properties', 'status', 'points'], transacting }
  );

  const result = {};
  _.forEach(responses, ({ question, ...response }) => {
    result[question] = response;
  });
  return result;
}

module.exports = { getUserQuestionResponses };
