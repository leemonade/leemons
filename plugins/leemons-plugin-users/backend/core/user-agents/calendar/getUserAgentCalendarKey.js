function getUserAgentCalendarKey({ userAgent, ctx }) {
  return ctx.prefixPN(`calendar.agent.${userAgent}`);
}

module.exports = { getUserAgentCalendarKey };
