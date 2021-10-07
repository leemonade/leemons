async function updateCalendarConfigs(id, config) {
  return leemons.api(
    {
      url: 'calendar/configs/update/:id',
      allAgents: true,
      query: { id },
    },
    {
      method: 'POST',
      body: {
        config,
      },
    }
  );
}

export default updateCalendarConfigs;
