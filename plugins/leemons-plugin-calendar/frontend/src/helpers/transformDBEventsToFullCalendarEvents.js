import * as _ from 'lodash';
import moment from 'moment';
import transformCalendarConfigToEvents from './transformCalendarConfigToEvents';
import { RRule } from 'rrule';

export default function transformDBEventsToFullCalendarEvents(events, calendars, config) {
  let goodEvents = [];
  const calendarsById = _.keyBy(calendars, 'id');

  _.forEach(events, (event) => {
    const ev = {
      title: event.title,
      allDay: !!event.isAllDay,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      originalEvent: {
        ...event,
        calendar: calendarsById[event.calendar],
      },
    };

    if (event.repeat && event.repeat !== 'dont_repeat') {
      if (event.repeat === 'every_day') {
        ev.rrule = {
          freq: RRule.DAILY,
        };
      }

      if (event.repeat === 'every_week') {
        const weekDay = moment(ev.start).isoWeekday();
        ev.rrule = {
          freq: RRule.WEEKLY,
          byweekday: [weekDay - 1],
        };
      }

      if (event.repeat === 'every_month') {
        ev.rrule = {
          freq: RRule.MONTHLY,
          bymonthday: [new Date(ev.start).getDate()],
        };
      }

      if (event.repeat === 'every_year') {
        ev.rrule = {
          freq: RRule.YEARLY,
          byyearday: [moment(ev.start).dayOfYear()],
        };
      }
    }

    goodEvents.push(ev);
  });

  if (config) {
    goodEvents = goodEvents.concat(transformCalendarConfigToEvents(config));
  }

  return goodEvents;
}
