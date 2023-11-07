async function removeCalendarConfig(id) {
  return leemons.api(`v1/calendar/calendar/configs/remove/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default removeCalendarConfig;
