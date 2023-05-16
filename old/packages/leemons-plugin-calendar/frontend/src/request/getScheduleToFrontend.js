async function getScheduleToFrontend(centerToken) {
  return leemons.api('calendar/schedule', {
    centerToken,
    method: 'POST',
  });
}

export default getScheduleToFrontend;
