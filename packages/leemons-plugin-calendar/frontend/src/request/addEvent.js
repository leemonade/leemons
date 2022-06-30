async function addEvent(centerToken, event) {
  return leemons.api('calendar/add/event', {
    centerToken,
    method: 'POST',
    body: {
      event,
    },
  });
}

export default addEvent;
