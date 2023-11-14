async function getCalendarsToFrontend(centerToken) {
  return leemons.api('v1/calendar/calendar', {
    centerToken,
    method: 'POST',
  });
}

export default getCalendarsToFrontend;
