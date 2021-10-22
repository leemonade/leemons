async function addCalendarConfig(config) {
  return leemons.api('calendar/configs/add', {
    allAgents: true,
    method: 'POST',
    body: {
      config,
    },
  });
}

export default addCalendarConfig;
