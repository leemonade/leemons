async function updateCalendarConfigs(id, config) {
  return leemons.api(`calendar/configs/update/${id}`, {
    allAgents: true,
    method: 'POST',
    body: {
      config,
    },
  });
}

export default updateCalendarConfigs;
