async function addCalendarConfig(config) {
  return leemons.api('v1/calendar/calendar/configs/add', {
    allAgents: true,
    method: 'POST',
    body: {
      config,
    },
  });
}

export default addCalendarConfig;
