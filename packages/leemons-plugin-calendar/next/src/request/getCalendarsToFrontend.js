async function getCalendarsToFrontend(centerToken) {
  return leemons.api(
    {
      url: 'calendar/calendar',
      centerToken,
    },
    {
      method: 'POST',
    }
  );
}

export default getCalendarsToFrontend;
