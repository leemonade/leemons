async function listCalendarConfigCalendars(id) {
  return leemons.api(`v1/calendar/calendar/configs/calendars/${id}`, {
    allAgents: true,
  });
}

export default listCalendarConfigCalendars;
