async function removeConfigEvent(config, event) {
  return leemons.api('calendar/configs/event/remove', {
    allAgents: true,
    method: 'POST',
    body: {
      config,
      event,
    },
  });
}

export default removeConfigEvent;
