async function getUserAgentCalendarKey({ userAgent }) {
  return `users.calendar.agent.${userAgent}`;
}

module.exports = { getUserAgentCalendarKey };
