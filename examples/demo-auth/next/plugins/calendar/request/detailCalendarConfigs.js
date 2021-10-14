async function detailCalendarConfigs(id) {
  return leemons.api({
    url: 'calendar/configs/detail/:id',
    allAgents: true,
    query: { id },
  });
}

export default detailCalendarConfigs;
