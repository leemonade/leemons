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
      startDate: dates.startDate instanceof Date ? dates.startDate.toISOString() : dates.startDate,
      endDate: dates.deadline instanceof Date ? dates.deadline.toISOString() : dates.deadline,
    },
    { calendar: _.map(classes, (classe) => `plugins.calendar.class.${classe}`), transacting }
  );
};
