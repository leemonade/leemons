async function listCalendarConfigs() {
  return leemons.api({
    url: 'calendar/configs/list',
    allAgents: true,
  });
}

export default listCalendarConfigs;
