async function updateEvent(centerToken, id, event) {
  return leemons.api('calendar/update/event', {
    centerToken,
    method: 'POST',
    body: {
      id,
      event,
    },
  });
}

export default updateEvent;
