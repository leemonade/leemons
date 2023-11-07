async function detailCalendarConfigs(id) {
  return leemons.api(`v1/calendar/calendar/configs/detail/${id}`, {
    allAgents: true,
  });
}

export default detailCalendarConfigs;
