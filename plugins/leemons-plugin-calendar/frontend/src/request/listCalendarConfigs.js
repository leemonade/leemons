async function listCalendarConfigs() {
  return leemons.api('v1/calendar/calendar/configs/list', {
    allAgents: true,
  });
}

export default listCalendarConfigs;
