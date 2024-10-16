/* eslint-disable no-param-reassign */
const _ = require('lodash');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { findQuestionResponses } = require('./findQuestionResponses');

dayjs.extend(duration);

async function getUserQuestionResponses({ instance, userAgent, ctx }) {
  // TODO: Do we need this?
  await ctx.tx.call('assignables.assignations.getAssignation', {
    assignableInstanceId: instance,
    user: userAgent,
  });

  const responses = await findQuestionResponses({
    query: {
      instance,
      userAgent,
    },
    columns: ['question', 'clues', 'cluesTypes', 'properties', 'status', 'points'],
    ctx,
  });

  const result = {};
  _.forEach(responses, ({ question, ...response }) => {
    result[question] = response;
  });
  return result;
}

module.exports = { getUserQuestionResponses };
