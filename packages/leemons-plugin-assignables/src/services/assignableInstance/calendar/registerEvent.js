const _ = require('lodash');

module.exports = async function registerEvent(
  assignable,
  classes,
  { id, isAllDay, dates, transacting } = {}
) {
  const calendarService = leemons.getPlugin('calendar').services.calendar;
  const calendarClasses = await calendarService.getCalendarsByClass(classes);
  return calendarService.addEvent(
    _.map(classes, (classe) => `plugins.calendar.class.${classe}`),
    {
      title: assignable.asset.name,
      isPrivate: true,
      isAllDay,
      type: 'plugins.calendar.task',
      startDate: dates.deadline
        ? typeof dates.deadline === 'string'
          ? dates.deadline
          : dates.deadline.toISOString()
        : undefined, // typeof dates.start === 'string' ? dates.start : dates.start.toISOString(),
      endDate: dates.deadline
        ? typeof dates.deadline === 'string'
          ? dates.deadline
          : dates.deadline.toISOString()
        : undefined,
      data: {
        instanceId: id,
        classes: _.map(calendarClasses, 'calendar'),
        hideInCalendar: !dates.deadline,
      },
    },
    { transacting }
  );
};
