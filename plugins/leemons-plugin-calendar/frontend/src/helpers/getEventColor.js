import { find } from 'lodash';

const getEventColor = (event, calendars) => {
  const multiSubjectColor = '#67728E';

  if (event.originalEvent?.data?.classes && event.originalEvent.data.classes.length >= 2) {
    return multiSubjectColor;
  }

  const eventCalendar = find(calendars, { id: event.originalEvent?.data?.classes?.[0] });

  if (eventCalendar) {
    return eventCalendar.bgColor;
  }

  const userCalendar = find(calendars, { isUserCalendar: true });

  if (userCalendar) {
    return userCalendar.bgColor;
  }

  return event.originalEvent?.calendar?.bgColor; // Negro como color de fallback
};

export { getEventColor };
