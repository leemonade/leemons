import * as _ from 'lodash';
import moment from 'moment';

export default function transformDBEventsToFullCalendarEvents(events, calendars) {
  const goodEvents = [];
  const calendarsById = _.keyBy(calendars, 'id');
  const rrule = window.rrule.default;

  _.forEach(events, (event) => {
    const ev = {
      title: event.title,
      allDay: !!event.isAllDay,
      start: event.startDate,
      end: event.endDate,
      originalEvent: {
        ...event,
        calendar: calendarsById[event.calendar],
      },
    };

    if (event.repeat) {
      // eslint-disable-next-line new-cap
      const diff = new moment.duration(new Date(ev.end).getTime() - new Date(ev.start).getTime());
      ev.duration = {
        days: Math.ceil(diff.asDays()),
      };

      if (event.repeat === 'every_day') {
        ev.rrule = {
          freq: rrule.DAILY,
          dtstart: ev.start,
        };
      }

      if (event.repeat === 'every_week') {
        ev.rrule = {
          freq: rrule.WEEKLY,
          byweekday: [new Date(ev.start).getUTCDay()],
          dtstart: ev.start,
        };
      }

      if (event.repeat === 'every_month') {
        ev.rrule = {
          freq: rrule.MONTHLY,
          bymonthday: [new Date(ev.start).getUTCDate()],
          dtstart: ev.start,
        };
      }

      if (event.repeat === 'every_year') {
        ev.rrule = {
          freq: rrule.YEARLY,
          byyearday: [moment(ev.start).dayOfYear()],
          dtstart: ev.start,
        };
      }
    }

    goodEvents.push(ev);
  });

  return goodEvents;
}
