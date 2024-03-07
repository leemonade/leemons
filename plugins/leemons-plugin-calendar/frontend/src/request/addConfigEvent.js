async function addConfigEvent(config, event) {
  return leemons.api('v1/calendar/calendar/configs/event/add', {
    allAgents: true,
    method: 'POST',
    body: {
      config,
      event,
    },
  });
}

export default addConfigEvent;
