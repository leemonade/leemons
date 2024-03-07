async function updateCalendarConfigs(id, config) {
  return leemons.api(`v1/calendar/calendar/configs/update/${id}`, {
    allAgents: true,
    method: 'POST',
    body: {
      config,
    },
  });
}

export default updateCalendarConfigs;
