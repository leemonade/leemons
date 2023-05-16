const _ = require('lodash');

module.exports = async function updateEvent(
  eventId,
  assignable,
  classes,
  { dates, transacting } = {}
) {
  return leemons.getPlugin('calendar').services.calendar.updateEvent(
    eventId,
    {
      title: assignable.asset.name,
      isPrivate: true,
      type: 'plugins.calendar.task',
      startDate: typeof dates.start === 'string' ? dates.start : dates.start.toISOString(),
      endDate: typeof dates.deadline === 'string' ? dates.deadline : dates.deadline.toISOString(),
    },
    { calendar: _.map(classes, (classe) => `plugins.calendar.class.${classe}`), transacting }
  );
};
