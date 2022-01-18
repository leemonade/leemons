async function removeEvent(centerToken, event) {
  return leemons.api('calendar/remove/event', {
    centerToken,
    method: 'POST',
    body: {
      event,
    },
  });
}

export default removeEvent;
