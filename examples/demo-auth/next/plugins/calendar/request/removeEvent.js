async function removeEvent(centerToken, event) {
  return leemons.api(
    {
      url: 'calendar/remove/event',
      centerToken,
    },
    {
      method: 'POST',
      body: {
        event,
      },
    }
  );
}

export default removeEvent;
