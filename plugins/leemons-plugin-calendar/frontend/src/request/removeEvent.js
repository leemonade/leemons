async function removeEvent(centerToken, event) {
  return leemons.api('v1/calendar/calendar/remove/event', {
    centerToken,
    method: 'POST',
    body: {
      event,
    },
  });
}

export default removeEvent;
