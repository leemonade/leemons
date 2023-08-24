async function listCalendarConfigs() {
  return leemons.api('calendar/configs/list', {
    allAgents: true,
  });
}

export default listCalendarConfigs;
