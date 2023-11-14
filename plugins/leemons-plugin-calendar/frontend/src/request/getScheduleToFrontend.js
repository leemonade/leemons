async function getScheduleToFrontend(centerToken) {
  return leemons.api('v1/calendar/calendar/schedule', {
    centerToken,
    method: 'POST',
  });
}

export default getScheduleToFrontend;
