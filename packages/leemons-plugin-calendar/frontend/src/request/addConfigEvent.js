async function addConfigEvent(config, event) {
  return leemons.api('calendar/configs/event/add', {
    allAgents: true,
    method: 'POST',
    body: {
      config,
      event,
    },
  });
}

export default addConfigEvent;
