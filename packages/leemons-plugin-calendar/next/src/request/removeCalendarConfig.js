async function removeCalendarConfig(id) {
  return leemons.api(
    {
      url: 'calendar/configs/remove/:id',
      allAgents: true,
      query: { id },
    },
    {
      method: 'DELETE',
    }
  );
}

export default removeCalendarConfig;
