async function getCalendarsToFrontend(centerToken, { showHiddenColumns } = {}) {
  return leemons.api('v1/calendar/calendar', {
    centerToken,
    method: 'POST',
    body: {
      showHiddenColumns,
    },
  });
}

export default getCalendarsToFrontend;
