import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import { RRule } from 'rrule';

dayjs.extend(isBetween);
dayjs.extend(utc);

const getProjectedEvents = (eventsProp, dateRange) => {
  if (!dateRange || !Array.isArray(eventsProp)) {
    console.warn('Invalid input to getProjectedEvents');
    return [];
  }

  const start = dayjs(dateRange.start).toDate();
  const end = dayjs(dateRange.end).toDate();

  const filteredEventsToShowInCalendar = eventsProp.filter(
    (event) => !event?.originalEvent?.data?.hideInCalendar
  );

  return filteredEventsToShowInCalendar.reduce((acc, ev) => {
    if (ev.rrule) {
      try {
        const rule = new RRule({
          ...ev.rrule,
          dtstart: dayjs.utc(ev.start).toDate(),
        });
        const occurrences = rule.between(start, end, true);
        const duration = dayjs(ev.end).diff(dayjs(ev.start));

        occurrences.forEach((date) => {
          const occurrenceStart = dayjs(date);
          const occurrenceEnd = occurrenceStart.add(duration, 'millisecond');

          acc.push({
            ...ev,
            start: occurrenceStart.toDate(),
            end: occurrenceEnd.toDate(),
          });

          if (!occurrenceStart.isSame(occurrenceEnd, 'day')) {
            acc.push({
              ...ev,
              isEndEvent: true,
              start: occurrenceEnd.startOf('day').toDate(),
              end: occurrenceEnd.toDate(),
            });
          }
        });
      } catch (error) {
        console.error('Error processing recurring event:', error, ev);
      }
    } else {
      const eventStart = dayjs(ev.start);
      const eventEnd = dayjs(ev.end);

      if (eventStart.isBefore(end) && eventEnd.isAfter(start)) {
        acc.push({ ...ev });

        if (!eventStart.isSame(eventEnd, 'day')) {
          acc.push({
            ...ev,
            isEndEvent: true,
            start: eventEnd.startOf('day').toDate(),
            end: eventEnd.toDate(),
          });
        }
      }
    }

    return acc;
  }, []);
};

export default getProjectedEvents;
