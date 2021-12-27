async function removeCalendarConfig(id) {
  return leemons.api(`calendar/configs/remove/${id}`, {
    allAgents: true,
    method: 'DELETE',
  });
}

export default removeCalendarConfig;
