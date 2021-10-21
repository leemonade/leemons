async function detailCalendarConfigs(id) {
  return leemons.api(`calendar/configs/detail/${id}`, {
    allAgents: true,
  });
}

export default detailCalendarConfigs;
