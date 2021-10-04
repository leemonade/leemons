import * as _ from 'lodash';

export default function transformCalendarConfigToEvents(config) {
  if (_.isArray(config.notSchoolDays) && config.notSchoolDays) {
    return _.map(config.notSchoolDays, (weekday) => {
      const dtstart = new Date(config.startYear, config.startMonth);
      dtstart.setUTCHours(0, 0, 0, 0);
      dtstart.setDate(dtstart.getDate() + weekday - dtstart.getDay());

      return {
        allDay: true,
        display: 'background',
        backgroundColor: '#333',
        duration: {
          days: 1,
        },
        rrule: {
          freq: window.rrule.default.WEEKLY,
          dtstart,
        },
      };
    });
  }

  return [];
}
