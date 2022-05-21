const _ = require('lodash');

module.exports = async function registerEvent(assignable, classes, { dates, transacting } = {}) {
  return leemons.getPlugin('calendar').services.calendar.addEvent(
    _.map(classes, (classe) => `plugins.calendar.class.${classe}`),
    {
      title: assignable.asset.name,
      isPrivate: true,
      type: 'plugins.calendar.task',
      startDate: typeof dates.start === 'string' ? dates.start : dates.start.toISOString(),
      endDate: typeof dates.deadline === 'string' ? dates.deadline : dates.deadline.toISOString(),
    },
    { transacting }
  );
};
