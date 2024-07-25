const getEventsByProgram = (events, programClasses, calendars, classe, inTab) => {
  const userCalendarId = calendars.find((cal) => cal.isUserCalendar)?.id;

  let relevantCalendarIds = [];
  if (inTab && classe) {
    const classCalendar = calendars.find((cal) => cal.key === `calendar.class.${classe.id}`);
    if (classCalendar) {
      relevantCalendarIds.push(classCalendar.id);
    }
  } else if (!inTab && programClasses) {
    relevantCalendarIds = calendars
      .filter((cal) => cal.isClass && programClasses.some((cls) => cal.key.includes(cls.id)))
      .map((cal) => cal.id);
  }

  return Object.values(events).filter((event) => {
    if (inTab && classe) {
      if (event.data && event.data.classes) {
        return event.data.classes.includes(relevantCalendarIds[0]);
      }
      return !event.data?.classes || event.calendar === relevantCalendarIds[0];
    }

    if (event.data && event.data.classes) {
      return event.data.classes.some((classId) => relevantCalendarIds.includes(classId));
    }

    if (event.calendar) {
      return event.calendar === userCalendarId || relevantCalendarIds.includes(event.calendar);
    }

    return !event.data?.classes;
  });
};

export { getEventsByProgram };
