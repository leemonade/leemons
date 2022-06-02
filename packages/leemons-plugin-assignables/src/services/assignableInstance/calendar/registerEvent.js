const _ = require('lodash');

module.exports = async function registerEvent(
  assignable,
  classes,
  { id, dates, transacting } = {}
) {
  const calendarService = leemons.getPlugin('calendar').services.calendar;
  const calendarClasses = await calendarService.getCalendarsByClass(classes);
  return calendarService.addEvent(
    _.map(classes, (classe) => `plugins.calendar.class.${classe}`),
    {
      title: assignable.asset.name,
      isPrivate: true,
      type: 'plugins.calendar.task',
      startDate: typeof dates.deadline === 'string' ? dates.deadline : dates.deadline.toISOString(), // typeof dates.start === 'string' ? dates.start : dates.start.toISOString(),
      endDate: typeof dates.deadline === 'string' ? dates.deadline : dates.deadline.toISOString(),
      data: {
        instanceId: id,
        classes: _.map(calendarClasses, 'calendar'),
      },
    },
    { transacting }
  );
};
