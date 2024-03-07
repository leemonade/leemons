const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
const { LeemonsError } = require('@leemons/error');

dayjs.extend(duration);

async function setQuestionResponse({ data, ctx }) {
  const { questionId, instanceId, value } = data;

  const [{ timestamps, finished }, instance] = await Promise.all([
    ctx.tx.call('assignables.assignations.getAssignation', {
      assignableInstanceId: instanceId,
      user: ctx.meta.userSession.userAgents[0].id,
    }),
    ctx.tx.call('assignables.assignableInstances.getAssignableInstance', {
      id: instanceId,
      details: true,
    }),
  ]);

  if (finished) {
    throw new LeemonsError(ctx, { message: 'Assignation finished' });
  }

  if (instance.duration) {
    // Check if not exceeding the duration
    const [_value, unit] = instance.duration.split(' ');
    const seconds = dayjs.duration({ [unit]: _value }).asSeconds();
    const start = new Date(timestamps.start);
    start.setSeconds(start.getSeconds() + seconds);
    if (new Date() > start) {
      throw new LeemonsError(ctx, {
        message: 'Time used up',
        customCode: 7001,
        httpStatusCode: 400,
      });
    }
  }

  return ctx.tx.db.FeedbackResponse.findOneAndUpdate(
    {
      question: questionId,
      instance: instanceId,
      userAgent: ctx.meta.userSession.userAgents[0].id,
    },
    {
      response: JSON.stringify(value),
      question: questionId,
      instance: instanceId,
      userAgent: ctx.meta.userSession.userAgents[0].id,
    },
    { upsert: true, new: true, lean: true }
  );
}

module.exports = setQuestionResponse;
