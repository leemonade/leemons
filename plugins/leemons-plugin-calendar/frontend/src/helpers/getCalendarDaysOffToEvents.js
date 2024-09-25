import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const getCalendarDaysOffToEvents = (schedule) => {
  if (!schedule) return [];
  const events = [];
  const courses = schedule?.courses.map((course) => course.id);

  courses?.forEach((courseId) => {
    const courseEvents = schedule?.config?.courseEvents[courseId];
    const { daysOffEvents, localEvents, regionalEvents } = schedule?.config?.regionalConfig ?? {
      daysOffEvents: [],
      localEvents: [],
      regionalEvents: [],
    };

    if (courseEvents) {
      events.push(...courseEvents);
    }
    events.push(...daysOffEvents, ...localEvents, ...regionalEvents);
  });

  return events
    .filter((event) => event.dayType !== 'schoolDays')
    .flatMap((event) => {
      const start = dayjs(event.startDate);
      const end = dayjs(event.endDate);
      const daysDifference = end.diff(start, 'day');

      if (daysDifference === 0) {
        return [
          {
            originalEvent: event,
            start: start.toDate(),
            end: end.toDate(),
            isDayOff: true,
          },
        ];
      }

      const multiDayEvents = [];
      for (let i = 0; i <= daysDifference; i++) {
        const currentDay = start.add(i, 'day');
        multiDayEvents.push({
          originalEvent: event,
          start: i === 0 ? start.toDate() : currentDay.startOf('day').toDate(),
          end: i === daysDifference ? end.toDate() : currentDay.endOf('day').toDate(),
          isDayOff: true,
        });
      }

      return multiDayEvents;
    });
};

export { getCalendarDaysOffToEvents };
