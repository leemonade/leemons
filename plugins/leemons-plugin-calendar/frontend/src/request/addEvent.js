async function addEvent(centerToken, event) {
  return leemons.api('v1/calendar/calendar/add/event', {
    centerToken,
    method: 'POST',
    body: {
      event,
    },
  });
}

export default addEvent;
