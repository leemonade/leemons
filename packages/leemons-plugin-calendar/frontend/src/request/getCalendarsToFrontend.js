async function getCalendarsToFrontend(centerToken) {
  return leemons.api('calendar/calendar', {
    centerToken,
    method: 'POST',
  });
}

export default getCalendarsToFrontend;
