const { diffHours } = require('@leemons/utils');

async function canSendEmail({ instance, dayLimits }) {
  if (dayLimits && instance.dates.deadline) {
    const hours = diffHours(new Date(), new Date(instance.dates.deadline));
    return hours < dayLimits * 24;
  }
  return true;
}

module.exports = { canSendEmail };
