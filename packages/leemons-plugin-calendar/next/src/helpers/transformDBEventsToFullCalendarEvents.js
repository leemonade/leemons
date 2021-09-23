import * as _ from 'lodash';

export default function transformDBEventsToFullCalendarEvents(events, calendars) {
  const goodEvents = [];
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

    // TODO: Añadir repetición de eventos
    goodEvents.push(ev);
  });

  return goodEvents;
}
