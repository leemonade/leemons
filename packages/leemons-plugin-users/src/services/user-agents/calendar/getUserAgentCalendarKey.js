function getUserAgentCalendarKey(id) {
  return leemons.plugin.prefixPN(`calendar.agent.${id}`);
}

module.exports = { getUserAgentCalendarKey };
