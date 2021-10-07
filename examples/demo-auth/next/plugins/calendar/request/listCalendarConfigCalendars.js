async function listCalendarConfigCalendars(id) {
  return leemons.api({
    url: 'calendar/configs/calendars/:id',
    allAgents: true,
    query: { id },
  });
}

export default listCalendarConfigCalendars;
