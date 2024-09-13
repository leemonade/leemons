const { diffHours } = require('@leemons/utils');

async function dateIsInLimits({ instance, dayLimits }) {
  if (dayLimits && instance.dates.deadline) {
    const hours = diffHours(new Date(), new Date(instance.dates.deadline));
    return hours < dayLimits * 24;
  }
  return true;
}

async function canSendEmail({ instance, userAgent, ignoreUserConfig, ctx }) {
  if (ignoreUserConfig) {
    return true;
  }

  const [canSend, dayLimits] = await Promise.all([
    ctx.tx.call('emails.config.getConfig', {
      userAgent: userAgent.id,
      keys: 'new-assignation-email',
    }),
    ctx.tx.call('emails.config.getConfig', {
      userAgent: userAgent.id,
      keys: 'new-assignation-per-day-email',
    }),
  ]);

  const isDayInLimits = await dateIsInLimits({ instance, dayLimits });

  return canSend && isDayInLimits;
}

module.exports = { canSendEmail };
