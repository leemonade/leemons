async function removeConfigEvent(config, event) {
  return leemons.api(
    {
      url: 'calendar/configs/event/remove',
      allAgents: true,
    },
    {
      method: 'POST',
      body: {
        config,
        event,
      },
    }
  );
}

export default removeConfigEvent;
