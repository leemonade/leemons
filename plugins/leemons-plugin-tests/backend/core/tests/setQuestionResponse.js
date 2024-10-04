/* eslint-disable no-param-reassign */
const { LeemonsError } = require('@leemons/error');
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const _ = require('lodash');

const { calculateUserAgentInstanceNote } = require('./calculateUserAgentInstanceNote');
const { findQuestionResponses } = require('./findQuestionResponses');

dayjs.extend(duration);

async function setQuestionResponse({ data, ctx }) {
  const { userSession } = ctx.meta;

  const [{ timestamps, finished, metadata }, [questionResponse], instance] = await Promise.all([
    ctx.tx.call('assignables.assignations.getAssignation', {
      assignableInstanceId: data.instance,
      user: userSession.userAgents[0].id,
    }),
    findQuestionResponses({
      query: {
        instance: data.instance,
        question: data.question,
        userAgent: userSession.userAgents[0].id,
      },
      ctx,
    }),
    ctx.tx.call('assignables.assignableInstances.getAssignableInstance', {
      id: data.instance,
      details: true,
    }),
  ]);

  if (finished) {
    throw new LeemonsError(ctx, { message: 'Assignation finished' });
  }

  if (questionResponse) {
    // Check if the data clues is less than the question response
    if (data.clues < questionResponse.clues) {
      throw new LeemonsError(ctx, {
        message: 'The track cannot be smaller than the one already stored.',
      });
    }
  } else if (data.clues > 1) {
    throw new LeemonsError(ctx, { message: 'The track cannot be greater than 1.' });
  }

  if (instance.duration) {
    // Check if not exceeding the duration
    const [value, unit] = instance.duration.split(' ');
    const seconds = dayjs.duration({ [unit]: value }).asSeconds();
    const start = new Date(timestamps.start);
    start.setSeconds(start.getSeconds() + seconds);
    if (new Date() > start) {
      throw new LeemonsError(ctx, {
        message: 'Time used up',
        httpStatusCode: 400,
        customCode: 7001,
      });
    }
  }

  let result = await ctx.tx.db.UserAgentAssignableInstanceResponses.findOneAndUpdate(
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
    { upsert: true, new: true, lean: true }
  );

  const { note, questions } = await calculateUserAgentInstanceNote({
    instanceId: data.instance,
    userAgent: userSession.userAgents[0].id,
    ctx,
  });

  result = await ctx.tx.db.UserAgentAssignableInstanceResponses.findOneAndUpdate(
    {
      instance: data.instance,
      question: data.question,
      userAgent: userSession.userAgents[0].id,
    },
    {
      ...questions[data.question],
    },
    { upsert: true, new: true, lean: true }
  );

  const classes = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: instance.classes,
  });

  await ctx.tx.call('assignables.assignations.updateAssignation', {
    assignation: {
      assignableInstance: data.instance,
      user: userSession.userAgents[0].id,
      grades: _.map(_.map(classes, 'subject.id'), (subjectId) => ({
        subject: subjectId,
        type: 'main',
        grade: note,
        gradedBy: 'auto-graded',
      })),
      metadata: {
        ...metadata,
        score: {
          count: Object.values(questions).filter(({ status }) => status === 'ok').length,
          total: Object.values(questions).length,
        },
      },
    },
  });

  return finished ? result : _.omit(result, ['status', 'points']);
}

module.exports = { setQuestionResponse };
