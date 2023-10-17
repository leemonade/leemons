async function listCalendarConfigCalendars(id) {
  return leemons.api(`calendar/configs/calendars/${id}`, {
    allAgents: true,
  });
}

export default listCalendarConfigCalendars;
